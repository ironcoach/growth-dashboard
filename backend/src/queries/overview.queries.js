const overviewQueries = {
  newCustomers: `
    SELECT COUNT(*)::int AS new_customers
    FROM customers
    WHERE created_at::date BETWEEN $1::date AND $2::date;
  `,
  revenueAndOrders: `
    SELECT
      COUNT(*)::int AS orders,
      COALESCE(SUM(amount), 0)::numeric(12,2) AS revenue
    FROM orders
    WHERE order_date::date BETWEEN $1::date AND $2::date;
  `,
  sessions: `
    SELECT COUNT(*)::int AS sessions
    FROM sessions
    WHERE session_started_at::date BETWEEN $1::date AND $2::date;
  `,
  purchasers: `
    SELECT COUNT(DISTINCT customer_id)::int AS purchasers
    FROM orders
    WHERE order_date::date BETWEEN $1::date AND $2::date;
  `
};

module.exports = overviewQueries;
