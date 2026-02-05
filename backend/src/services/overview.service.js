const pool = require("../db/pool");
const q = require("../queries/overview.queries");

async function getOverview(startDate, endDate) {
  const client = await pool.connect();
  try {
    const [newCustomersRes, revenueRes, sessionsRes, purchasersRes] = await Promise.all([
      client.query(q.newCustomers, [startDate, endDate]),
      client.query(q.revenueAndOrders, [startDate, endDate]),
      client.query(q.sessions, [startDate, endDate]),
      client.query(q.purchasers, [startDate, endDate])
    ]);

    const newCustomers = newCustomersRes.rows[0].new_customers || 0;
    const orders = revenueRes.rows[0].orders || 0;
    const revenue = Number(revenueRes.rows[0].revenue || 0);
    const sessions = sessionsRes.rows[0].sessions || 0;
    const purchasers = purchasersRes.rows[0].purchasers || 0;

    const conversionRate = sessions > 0 ? purchasers / sessions : 0;
    const avgOrderValue = orders > 0 ? revenue / orders : 0;

    return {
      startDate,
      endDate,
      kpis: {
        newCustomers,
        sessions,
        purchasers,
        orders,
        revenue,
        conversionRate,
        avgOrderValue
      }
    };
  } finally {
    client.release();
  }
}

module.exports = { getOverview };
