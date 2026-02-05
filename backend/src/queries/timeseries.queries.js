function buildTimeseriesQuery(grain) {
  return `
    WITH date_spine AS (
      SELECT generate_series(
        date_trunc('${grain}', $1::timestamp),
        date_trunc('${grain}', $2::timestamp),
        interval '1 ${grain}'
      ) AS bucket
    ),
    revenue_orders AS (
      SELECT
        date_trunc('${grain}', order_date)::timestamp AS bucket,
        COUNT(*)::int AS orders,
        COALESCE(SUM(amount), 0)::numeric(12,2) AS revenue,
        COUNT(DISTINCT customer_id)::int AS purchasers
      FROM orders
      WHERE order_date::date BETWEEN $1::date AND $2::date
      GROUP BY 1
    ),
    new_customers AS (
      SELECT
        date_trunc('${grain}', created_at)::timestamp AS bucket,
        COUNT(*)::int AS new_customers
      FROM customers
      WHERE created_at::date BETWEEN $1::date AND $2::date
      GROUP BY 1
    ),
    sessions_agg AS (
      SELECT
        date_trunc('${grain}', session_started_at)::timestamp AS bucket,
        COUNT(*)::int AS sessions
      FROM sessions
      WHERE session_started_at::date BETWEEN $1::date AND $2::date
      GROUP BY 1
    )
    SELECT
      ds.bucket::date AS period_start,
      COALESCE(nc.new_customers, 0)::int AS new_customers,
      COALESCE(sa.sessions, 0)::int AS sessions,
      COALESCE(ro.purchasers, 0)::int AS purchasers,
      COALESCE(ro.orders, 0)::int AS orders,
      COALESCE(ro.revenue, 0)::numeric(12,2) AS revenue
    FROM date_spine ds
    LEFT JOIN new_customers nc ON ds.bucket = nc.bucket
    LEFT JOIN sessions_agg sa ON ds.bucket = sa.bucket
    LEFT JOIN revenue_orders ro ON ds.bucket = ro.bucket
    ORDER BY ds.bucket;
  `;
}

module.exports = { buildTimeseriesQuery };
