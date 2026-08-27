-- =============================================================================
-- BLAZON — initial schema
-- Blueprint Section 14. Twenty tables, PostgreSQL only.
--
-- Conventions:
--   BIGSERIAL primary keys, plus an unguessable uuid on leads and
--   contact_messages. created_at / updated_at TIMESTAMPTZ everywhere with a
--   shared trigger. Content tables soft-delete via status + deleted_at so a
--   live page never 404s because a row was removed. sort_order on every
--   user-orderable collection. CITEXT slugs on every publicly routed entity.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role       AS ENUM ('admin','editor');
CREATE TYPE content_status  AS ENUM ('draft','published','archived');
CREATE TYPE lead_status     AS ENUM ('new','contacted','qualified','won','lost','spam');
CREATE TYPE message_status  AS ENUM ('new','read','replied','archived','spam');
CREATE TYPE selling_status  AS ENUM ('already_selling','not_yet_selling');
CREATE TYPE seller_platform AS ENUM ('seller_central','vendor_central','both','none');
CREATE TYPE pricing_model   AS ENUM ('getting_started','operating');
CREATE TYPE dispatch_status AS ENUM ('pending','sent','failed','skipped');

-- Shared updated_at trigger ---------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. users --------------------------------------------------------------------
CREATE TABLE users (
  id                 BIGSERIAL PRIMARY KEY,
  email              CITEXT      NOT NULL UNIQUE,
  password_hash      TEXT        NOT NULL,
  full_name          TEXT        NOT NULL,
  role               user_role   NOT NULL DEFAULT 'editor',
  is_active          BOOLEAN     NOT NULL DEFAULT true,
  last_login_at      TIMESTAMPTZ,
  failed_login_count INTEGER     NOT NULL DEFAULT 0,
  locked_until       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. refresh_tokens — only the SHA-256 hash is stored -------------------------
CREATE TABLE refresh_tokens (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT        NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_refresh_tokens_user    ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- 3. audit_log ----------------------------------------------------------------
CREATE TABLE audit_log (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT REFERENCES users(id) ON DELETE SET NULL,
  action      TEXT   NOT NULL,
  entity_type TEXT   NOT NULL,
  entity_id   BIGINT,
  changes     JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_entity  ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- 4. site_settings — only is_public keys are ever exposed publicly -------------
CREATE TABLE site_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB   NOT NULL,
  description TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. media_assets -------------------------------------------------------------
CREATE TABLE media_assets (
  id            BIGSERIAL PRIMARY KEY,
  filename      TEXT NOT NULL,
  original_name TEXT,
  mime_type     TEXT NOT NULL,
  size_bytes    BIGINT NOT NULL CHECK (size_bytes > 0),
  width         INTEGER,
  height        INTEGER,
  storage_path  TEXT NOT NULL,
  alt_text      TEXT,
  uploaded_by   BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. leads --------------------------------------------------------------------
CREATE TABLE leads (
  id                   BIGSERIAL PRIMARY KEY,
  uuid                 UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  first_name           TEXT   NOT NULL,
  last_name            TEXT   NOT NULL,
  email                CITEXT NOT NULL,
  phone                TEXT,
  company              TEXT,
  brand_name           TEXT,
  store_url            TEXT,
  selling_status       selling_status NOT NULL,
  platform             seller_platform,
  monthly_revenue_band TEXT,
  sku_count_band       TEXT,
  marketplaces         TEXT[],
  product_category     TEXT,
  primary_goal         TEXT,
  message              TEXT,
  consent_given        BOOLEAN     NOT NULL DEFAULT false,
  status               lead_status NOT NULL DEFAULT 'new',
  assigned_to          BIGINT REFERENCES users(id) ON DELETE SET NULL,
  notify_status        dispatch_status DEFAULT 'pending',
  crm_status           dispatch_status DEFAULT 'skipped',
  crm_attempts         INTEGER DEFAULT 0,
  crm_last_error       TEXT,
  source_page          TEXT,
  utm_source           TEXT,
  utm_medium           TEXT,
  utm_campaign         TEXT,
  ip_address           INET,
  user_agent           TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_leads_status   ON leads(status);
CREATE INDEX idx_leads_created  ON leads(created_at DESC);
CREATE INDEX idx_leads_email    ON leads(email);
CREATE INDEX idx_leads_selling  ON leads(selling_status);
-- Drives the dashboard's needs-attention panel.
CREATE INDEX idx_leads_dispatch_failed ON leads(created_at DESC)
  WHERE crm_status = 'failed' OR notify_status = 'failed';

-- 7. lead_events — append-only trail ------------------------------------------
CREATE TABLE lead_events (
  id         BIGSERIAL PRIMARY KEY,
  lead_id    BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT   NOT NULL,
  note       TEXT,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_lead_events_lead ON lead_events(lead_id, created_at DESC);

-- 8. contact_messages ---------------------------------------------------------
CREATE TABLE contact_messages (
  id            BIGSERIAL PRIMARY KEY,
  uuid          UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  name          TEXT   NOT NULL,
  email         CITEXT NOT NULL,
  company       TEXT,
  phone         TEXT,
  inquiry_type  TEXT,
  message       TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
  consent_given BOOLEAN NOT NULL DEFAULT false,
  status        message_status NOT NULL DEFAULT 'new',
  ip_address    INET,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_status  ON contact_messages(status);
CREATE INDEX idx_messages_created ON contact_messages(created_at DESC);

-- 9. consent_logs -------------------------------------------------------------
CREATE TABLE consent_logs (
  id             BIGSERIAL PRIMARY KEY,
  visitor_id     TEXT    NOT NULL,
  necessary      BOOLEAN NOT NULL DEFAULT true,
  analytics      BOOLEAN NOT NULL DEFAULT false,
  marketing      BOOLEAN NOT NULL DEFAULT false,
  policy_version TEXT    NOT NULL,
  ip_address     INET,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_consent_visitor ON consent_logs(visitor_id, created_at DESC);

-- 10. hero_slides -------------------------------------------------------------
CREATE TABLE hero_slides (
  id                  BIGSERIAL PRIMARY KEY,
  eyebrow             TEXT,
  headline            TEXT NOT NULL,
  accent_line         TEXT,               -- the lime "All of them." line
  lead_text           TEXT,
  cta_label           TEXT,
  cta_url             TEXT,
  secondary_cta_label TEXT,
  secondary_cta_url   TEXT,
  trust_line          TEXT,
  media_id            BIGINT REFERENCES media_assets(id) ON DELETE SET NULL,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  status              content_status NOT NULL DEFAULT 'draft',
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. kpi_metrics -------------------------------------------------------------
-- value_numeric + prefix/suffix/display_value: "80+" animates the numeral while
-- the plus stays static, and "1 yr 7 mo" renders without a broken counter.
CREATE TABLE kpi_metrics (
  id             BIGSERIAL PRIMARY KEY,
  label          TEXT NOT NULL,
  value_numeric  NUMERIC,
  prefix         TEXT NOT NULL DEFAULT '',
  suffix         TEXT NOT NULL DEFAULT '',
  display_value  TEXT,
  substantiation TEXT,
  context        TEXT NOT NULL DEFAULT 'home',
  sort_order     INTEGER NOT NULL DEFAULT 0,
  status         content_status NOT NULL DEFAULT 'draft',
  deleted_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. categories --------------------------------------------------------------
CREATE TABLE categories (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT   NOT NULL,
  slug       CITEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. clients -----------------------------------------------------------------
-- consent_confirmed is not optional: no client logo renders publicly without it.
CREATE TABLE clients (
  id                  BIGSERIAL PRIMARY KEY,
  name                TEXT   NOT NULL,
  slug                CITEXT NOT NULL UNIQUE,
  logo_media_id       BIGINT REFERENCES media_assets(id) ON DELETE SET NULL,
  logo_mono_media_id  BIGINT REFERENCES media_assets(id) ON DELETE SET NULL,
  storefront_url      TEXT,
  website_url         TEXT,
  show_in_marquee     BOOLEAN NOT NULL DEFAULT true,
  consent_confirmed   BOOLEAN NOT NULL DEFAULT false,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  status              content_status NOT NULL DEFAULT 'draft',
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. client_categories -------------------------------------------------------
CREATE TABLE client_categories (
  client_id   BIGINT NOT NULL REFERENCES clients(id)    ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (client_id, category_id)
);

-- 15. services ----------------------------------------------------------------
CREATE TABLE services (
  id                 BIGSERIAL PRIMARY KEY,
  slug               CITEXT NOT NULL UNIQUE,
  title              TEXT   NOT NULL,
  summary            TEXT,
  icon_key           TEXT,
  body               JSONB,              -- ordered content blocks
  is_additional_cost BOOLEAN NOT NULL DEFAULT false,
  sort_order         INTEGER NOT NULL DEFAULT 0,
  status             content_status NOT NULL DEFAULT 'draft',
  deleted_at         TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. service_items — CASCADE: an item is meaningless without its group --------
CREATE TABLE service_items (
  id                 BIGSERIAL PRIMARY KEY,
  service_id         BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name               TEXT   NOT NULL,
  description        TEXT,
  is_additional_cost BOOLEAN NOT NULL DEFAULT false,
  sort_order         INTEGER NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_service_items_service ON service_items(service_id, sort_order);

-- 17. testimonials ------------------------------------------------------------
CREATE TABLE testimonials (
  id                BIGSERIAL PRIMARY KEY,
  quote             TEXT NOT NULL,
  author_name       TEXT NOT NULL,
  author_role       TEXT,
  client_id         BIGINT REFERENCES clients(id)  ON DELETE SET NULL,
  service_id        BIGINT REFERENCES services(id) ON DELETE SET NULL,
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  consent_confirmed BOOLEAN NOT NULL DEFAULT false,
  source_date       DATE,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  status            content_status NOT NULL DEFAULT 'draft',
  deleted_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_testimonials_service  ON testimonials(service_id);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE status = 'published';

-- 18. case_studies ------------------------------------------------------------
CREATE TABLE case_studies (
  id              BIGSERIAL PRIMARY KEY,
  slug            CITEXT NOT NULL UNIQUE,
  client_id       BIGINT REFERENCES clients(id)     ON DELETE SET NULL,
  category_id     BIGINT REFERENCES categories(id)  ON DELETE SET NULL,
  service_id      BIGINT REFERENCES services(id)    ON DELETE SET NULL,
  title           TEXT NOT NULL,
  summary         TEXT,
  headline_metric TEXT,
  challenge       TEXT,
  strategy        TEXT,
  execution       TEXT,
  results         TEXT,
  quote           TEXT,
  quote_author    TEXT,
  chart_data      JSONB,              -- the redrawn series
  hero_media_id   BIGINT REFERENCES media_assets(id) ON DELETE SET NULL,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  status          content_status NOT NULL DEFAULT 'draft',
  published_at    TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_case_studies_slug      ON case_studies(slug);
CREATE INDEX idx_case_studies_published ON case_studies(status, published_at DESC);
CREATE INDEX idx_case_studies_featured  ON case_studies(is_featured) WHERE status = 'published';

-- 19. case_study_metrics ------------------------------------------------------
CREATE TABLE case_study_metrics (
  id             BIGSERIAL PRIMARY KEY,
  case_study_id  BIGINT NOT NULL REFERENCES case_studies(id) ON DELETE CASCADE,
  label          TEXT   NOT NULL,
  value_numeric  NUMERIC,
  prefix         TEXT NOT NULL DEFAULT '',
  suffix         TEXT NOT NULL DEFAULT '',
  display_value  TEXT,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_case_metrics_study ON case_study_metrics(case_study_id, sort_order);

-- 20. comparison_rows ---------------------------------------------------------
CREATE TABLE comparison_rows (
  id             BIGSERIAL PRIMARY KEY,
  category_label TEXT NOT NULL,
  our_approach   TEXT NOT NULL,
  their_approach TEXT NOT NULL,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  status         content_status NOT NULL DEFAULT 'draft',
  deleted_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. pricing_tiers -----------------------------------------------------------
CREATE TABLE pricing_tiers (
  id                   BIGSERIAL PRIMARY KEY,
  model                pricing_model NOT NULL,
  name                 TEXT NOT NULL,
  sku_min              INTEGER,
  sku_max              INTEGER,
  intro_fee            NUMERIC,
  intro_period_months  INTEGER,
  base_fee             NUMERIC,
  performance_pct      NUMERIC NOT NULL DEFAULT 5,
  flat_fee             NUMERIC,
  is_quote_only        BOOLEAN NOT NULL DEFAULT false,
  is_featured          BOOLEAN NOT NULL DEFAULT false,
  sort_order           INTEGER NOT NULL DEFAULT 0,
  status               content_status NOT NULL DEFAULT 'draft',
  deleted_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_pricing_model ON pricing_tiers(model, sort_order);

-- 22. articles ----------------------------------------------------------------
CREATE TABLE articles (
  id              BIGSERIAL PRIMARY KEY,
  slug            CITEXT NOT NULL UNIQUE,
  title           TEXT   NOT NULL,
  excerpt         TEXT,
  body            JSONB  NOT NULL,
  author_name     TEXT,
  hero_media_id   BIGINT REFERENCES media_assets(id) ON DELETE SET NULL,
  reading_minutes INTEGER,
  category_id     BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  original_source TEXT,               -- guest-post attribution, for canonicals
  status          content_status NOT NULL DEFAULT 'draft',
  published_at    TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_articles_published ON articles(status, published_at DESC);

-- 23. team_members ------------------------------------------------------------
CREATE TABLE team_members (
  id               BIGSERIAL PRIMARY KEY,
  slug             CITEXT NOT NULL UNIQUE,
  full_name        TEXT   NOT NULL,
  job_title        TEXT   NOT NULL,
  bio              TEXT,
  photo_media_id   BIGINT REFERENCES media_assets(id) ON DELETE SET NULL,
  linkedin_url     TEXT,
  years_experience INTEGER,
  is_leadership    BOOLEAN NOT NULL DEFAULT false,
  location         TEXT NOT NULL DEFAULT 'United States',
  sort_order       INTEGER NOT NULL DEFAULT 0,
  status           content_status NOT NULL DEFAULT 'draft',
  deleted_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 24. page_seo ----------------------------------------------------------------
CREATE TABLE page_seo (
  id               BIGSERIAL PRIMARY KEY,
  route            TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  meta_description TEXT,
  og_title         TEXT,
  og_description   TEXT,
  og_media_id      BIGINT REFERENCES media_assets(id) ON DELETE SET NULL,
  canonical_url    TEXT,
  noindex          BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at triggers ---------------------------------------------------------
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
     WHERE table_schema = 'public' AND column_name = 'updated_at'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%1$s_updated_at BEFORE UPDATE ON %1$I
         FOR EACH ROW EXECUTE FUNCTION set_updated_at()', t);
  END LOOP;
END $$;
