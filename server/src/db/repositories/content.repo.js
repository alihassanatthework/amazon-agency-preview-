import { query } from '../pool.js';

/** SQL lives only here. Controllers and services never see it. */

export const getHero = () => query(
  `SELECT eyebrow, headline, accent_line, lead_text, cta_label, cta_url,
          secondary_cta_label, secondary_cta_url, trust_line
     FROM hero_slides
    WHERE status='published' AND deleted_at IS NULL
    ORDER BY sort_order LIMIT 1`).then((r) => r.rows[0] ?? null);

export const getMetrics = (context = 'home') => query(
  `SELECT label, value_numeric, prefix, suffix, display_value, substantiation
     FROM kpi_metrics
    WHERE status='published' AND deleted_at IS NULL AND context=$1
    ORDER BY sort_order`, [context]).then((r) => r.rows);

export const getClients = () => query(
  `SELECT c.id, c.name, c.slug, c.storefront_url,
          COALESCE(json_agg(cat.slug) FILTER (WHERE cat.id IS NOT NULL), '[]') AS categories
     FROM clients c
     LEFT JOIN client_categories cc ON cc.client_id = c.id
     LEFT JOIN categories cat       ON cat.id = cc.category_id
    WHERE c.status='published' AND c.deleted_at IS NULL
      AND c.show_in_marquee AND c.consent_confirmed
    GROUP BY c.id
    ORDER BY c.sort_order, c.name`).then((r) => r.rows);

export const getCategories = () => query(
  `SELECT name, slug FROM categories ORDER BY sort_order`).then((r) => r.rows);

export const getComparison = () => query(
  `SELECT category_label, our_approach, their_approach
     FROM comparison_rows
    WHERE status='published' AND deleted_at IS NULL
    ORDER BY sort_order`).then((r) => r.rows);

export const getTestimonials = ({ featured, service, limit } = {}) => query(
  `SELECT t.quote, t.author_name, t.author_role, t.is_featured,
          c.name AS company, c.slug AS client_slug, c.storefront_url,
          s.slug AS service_slug
     FROM testimonials t
     LEFT JOIN clients  c ON c.id = t.client_id
     LEFT JOIN services s ON s.id = t.service_id
    WHERE t.status='published' AND t.deleted_at IS NULL AND t.consent_confirmed
      AND ($1::boolean IS NULL OR t.is_featured = $1)
      AND ($2::text    IS NULL OR s.slug = $2)
    ORDER BY t.sort_order
    LIMIT COALESCE($3::int, 100)`,
  [featured ?? null, service ?? null, limit ?? null]).then((r) => r.rows);

export const getPublicSettings = () => query(
  `SELECT key, value FROM site_settings WHERE is_public = true`)
  .then((r) => Object.fromEntries(r.rows.map((x) => [x.key, x.value])));

export const getServices = () => query(
  `SELECT s.slug, s.title, s.summary, s.icon_key, s.is_additional_cost,
          count(si.id)::int AS item_count
     FROM services s
     LEFT JOIN service_items si ON si.service_id = s.id
    WHERE s.status='published' AND s.deleted_at IS NULL
    GROUP BY s.id
    ORDER BY s.sort_order`).then((r) => r.rows);

export const getServiceBySlug = (slug) => query(
  `SELECT s.slug, s.title, s.summary, s.icon_key, s.body, s.is_additional_cost,
          COALESCE(json_agg(
            jsonb_build_object('name', si.name, 'description', si.description,
                               'additionalCost', si.is_additional_cost)
            ORDER BY si.sort_order
          ) FILTER (WHERE si.id IS NOT NULL), '[]') AS items
     FROM services s
     LEFT JOIN service_items si ON si.service_id = s.id
    WHERE s.slug = $1 AND s.status='published' AND s.deleted_at IS NULL
    GROUP BY s.id`, [slug]).then((r) => r.rows[0] ?? null);

export const getPricing = () => query(
  `SELECT model, name, sku_min, sku_max, intro_fee, intro_period_months,
          base_fee, performance_pct, flat_fee, is_quote_only, is_featured
     FROM pricing_tiers
    WHERE status='published' AND deleted_at IS NULL
    ORDER BY model, sort_order`).then((r) => r.rows);

export const getCaseStudies = ({ category, featured, limit = 12, offset = 0 } = {}) => query(
  `SELECT cs.slug, cs.title, cs.summary, cs.headline_metric, cs.is_featured,
          cl.name AS client, cat.slug AS category, count(*) OVER() AS total_count
     FROM case_studies cs
     LEFT JOIN clients cl    ON cl.id = cs.client_id
     LEFT JOIN categories cat ON cat.id = cs.category_id
    WHERE cs.status='published' AND cs.deleted_at IS NULL
      AND ($1::text    IS NULL OR cat.slug = $1)
      AND ($2::boolean IS NULL OR cs.is_featured = $2)
    ORDER BY cs.published_at DESC NULLS LAST, cs.id DESC
    LIMIT $3 OFFSET $4`,
  [category ?? null, featured ?? null, limit, offset]).then((r) => r.rows);

export const getArticles = ({ limit = 12, offset = 0 } = {}) => query(
  `SELECT slug, title, excerpt, reading_minutes, original_source, published_at,
          count(*) OVER() AS total_count
     FROM articles
    WHERE status='published' AND deleted_at IS NULL
    ORDER BY published_at DESC NULLS LAST, id DESC
    LIMIT $1 OFFSET $2`, [limit, offset]).then((r) => r.rows);

export const getArticleBySlug = (slug) => query(
  `SELECT slug, title, excerpt, body, author_name, reading_minutes,
          original_source, published_at
     FROM articles
    WHERE slug=$1 AND status='published' AND deleted_at IS NULL`, [slug])
  .then((r) => r.rows[0] ?? null);

export const getTeam = () => query(
  `SELECT slug, full_name, job_title, bio, linkedin_url, years_experience,
          is_leadership, location
     FROM team_members
    WHERE status='published' AND deleted_at IS NULL
    ORDER BY is_leadership DESC, sort_order`).then((r) => r.rows);

export const getSeo = (route) => query(
  `SELECT route, title, meta_description, og_title, og_description,
          canonical_url, noindex
     FROM page_seo WHERE route=$1`, [route]).then((r) => r.rows[0] ?? null);
