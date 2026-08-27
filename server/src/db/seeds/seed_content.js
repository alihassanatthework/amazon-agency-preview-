/**
 * Seeds every content table from the _Marketing archive.
 * Idempotent: truncates the content tables, then re-inserts. Never touches
 * users, leads, contact_messages, consent_logs or audit_log.
 */
import 'dotenv/config';
import { pool, withTransaction } from '../pool.js';
import * as data from './content.data.js';

const SERVICE_COUNT_NOTE = 36; // see Q-11 — the source lists 36, not 38

async function seed() {
  await withTransaction(async (c) => {
    await c.query(`TRUNCATE
      client_categories, testimonials, case_study_metrics, case_studies,
      service_items, services, clients, categories, kpi_metrics,
      comparison_rows, pricing_tiers, articles, team_members, hero_slides,
      site_settings, page_seo RESTART IDENTITY CASCADE`);

    // Settings ---------------------------------------------------------------
    for (const [key, value, description, isPublic] of data.settings) {
      await c.query(
        `INSERT INTO site_settings (key, value, description, is_public)
         VALUES ($1, $2::jsonb, $3, $4)`,
        [key, value, description, isPublic],
      );
    }

    // KPI metrics ------------------------------------------------------------
    for (const [i, m] of data.kpiMetrics.entries()) {
      await c.query(
        `INSERT INTO kpi_metrics
           (label, value_numeric, prefix, suffix, display_value, substantiation,
            context, sort_order, status)
         VALUES ($1,$2,$3,$4,$5,$6,'home',$7,'published')`,
        [m.label, m.value, m.prefix, m.suffix, m.display, m.sub, i + 1],
      );
    }

    // Categories -------------------------------------------------------------
    const categoryId = {};
    for (const [i, [name, slug]] of data.categories.entries()) {
      const { rows } = await c.query(
        `INSERT INTO categories (name, slug, sort_order) VALUES ($1,$2,$3) RETURNING id`,
        [name, slug, i + 1],
      );
      categoryId[slug] = rows[0].id;
    }

    // Clients ----------------------------------------------------------------
    const clientId = {};
    const allClients = [
      ...data.clients.map((x) => ({ ...x, marquee: true })),
      ...data.logolessClients.map((x) => ({ ...x, marquee: false })),
    ];
    for (const [i, cl] of allClients.entries()) {
      const { rows } = await c.query(
        `INSERT INTO clients (name, slug, show_in_marquee, consent_confirmed,
                              sort_order, status)
         VALUES ($1,$2,$3,true,$4,'published') RETURNING id`,
        [cl.name, cl.slug, cl.marquee, i + 1],
      );
      clientId[cl.slug] = rows[0].id;
      for (const cat of cl.categories) {
        await c.query(
          `INSERT INTO client_categories (client_id, category_id) VALUES ($1,$2)`,
          [rows[0].id, categoryId[cat]],
        );
      }
    }

    // Services and their items ----------------------------------------------
    const serviceId = {};
    let itemCount = 0;
    for (const s of data.services) {
      const { rows } = await c.query(
        `INSERT INTO services (slug, title, summary, icon_key, is_additional_cost,
                               sort_order, status)
         VALUES ($1,$2,$3,$4,$5,$6,'published') RETURNING id`,
        [s.slug, s.title, s.summary, s.icon, !!s.additionalCost, s.order],
      );
      serviceId[s.slug] = rows[0].id;
      for (const [j, item] of s.items.entries()) {
        const [name, description, additional] = item;
        await c.query(
          `INSERT INTO service_items
             (service_id, name, description, is_additional_cost, sort_order)
           VALUES ($1,$2,$3,$4,$5)`,
          [rows[0].id, name, description, !!additional, j + 1],
        );
        itemCount += 1;
      }
    }

    // Testimonials -----------------------------------------------------------
    for (const t of data.testimonials) {
      await c.query(
        `INSERT INTO testimonials
           (quote, author_name, client_id, service_id, is_featured,
            consent_confirmed, source_date, sort_order, status)
         VALUES ($1,$2,$3,$4,$5,true,$6,$7,'published')`,
        [t.quote, t.author, clientId[t.clientSlug],
         t.service ? serviceId[t.service] : null,
         t.featured, t.date, t.order],
      );
    }

    // Comparison rows --------------------------------------------------------
    for (const [i, [label, ours, theirs]] of data.comparisonRows.entries()) {
      await c.query(
        `INSERT INTO comparison_rows
           (category_label, our_approach, their_approach, sort_order, status)
         VALUES ($1,$2,$3,$4,'published')`,
        [label, ours, theirs, i + 1],
      );
    }

    // Pricing ----------------------------------------------------------------
    for (const t of data.pricingTiers) {
      await c.query(
        `INSERT INTO pricing_tiers
           (model, name, sku_min, sku_max, intro_fee, intro_period_months,
            base_fee, performance_pct, flat_fee, is_quote_only, is_featured,
            sort_order, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,5,$8,$9,$10,$11,'published')`,
        [t.model, t.name, t.skuMin, t.skuMax, t.introFee ?? null,
         t.introFee ? 3 : null, t.base ?? null, t.flat ?? null,
         !!t.quoteOnly, !!t.featured, t.order],
      );
    }

    // Hero -------------------------------------------------------------------
    const h = data.hero;
    await c.query(
      `INSERT INTO hero_slides
         (eyebrow, headline, accent_line, lead_text, cta_label, cta_url,
          secondary_cta_label, secondary_cta_url, trust_line, sort_order, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,1,'published')`,
      [h.eyebrow, h.headline, h.accentLine, h.lead, h.ctaLabel, h.ctaUrl,
       h.secondaryLabel, h.secondaryUrl, h.trustLine],
    );

    return itemCount;
  }).then((itemCount) => {
    if (itemCount !== SERVICE_COUNT_NOTE) {
      throw new Error(
        `Seeded ${itemCount} service items, expected ${SERVICE_COUNT_NOTE}. ` +
        'The published service count is derived from this table — see Q-11.',
      );
    }
  });

  const counts = await pool.query(`
    SELECT 'settings' t, count(*) n FROM site_settings
    UNION ALL SELECT 'kpi_metrics',     count(*) FROM kpi_metrics
    UNION ALL SELECT 'categories',      count(*) FROM categories
    UNION ALL SELECT 'clients',         count(*) FROM clients
    UNION ALL SELECT 'services',        count(*) FROM services
    UNION ALL SELECT 'service_items',   count(*) FROM service_items
    UNION ALL SELECT 'testimonials',    count(*) FROM testimonials
    UNION ALL SELECT 'comparison_rows', count(*) FROM comparison_rows
    UNION ALL SELECT 'pricing_tiers',   count(*) FROM pricing_tiers
    UNION ALL SELECT 'hero_slides',     count(*) FROM hero_slides
    ORDER BY 1`);
  console.table(counts.rows);
  await pool.end();
}

seed().catch((err) => {
  console.error('[seed] failed:', err.message);
  process.exit(1);
});
