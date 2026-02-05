const pool = require("../db/pool");
const { buildTimeseriesQuery } = require("../queries/timeseries.queries");

const ALLOWED_GRAINS = new Set(["day", "week", "month"]);

function isValidDate(dateStr) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

async function getTimeseries(startDate, endDate, grain = "week") {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.");
  }

  if (!ALLOWED_GRAINS.has(grain)) {
    throw new Error("Invalid grain. Allowed: day, week, month.");
  }

  const sql = buildTimeseriesQuery(grain);

  const client = await pool.connect();
  try {
    const result = await client.query(sql, [startDate, endDate]);

    const points = result.rows.map((r) => {
      const revenue = Number(r.revenue || 0);
      const orders = Number(r.orders || 0);
      const sessions = Number(r.sessions || 0);
      const purchasers = Number(r.purchasers || 0);

      return {
        periodStart: r.period_start, // YYYY-MM-DD
        newCustomers: Number(r.new_customers || 0),
        sessions,
        purchasers,
        orders,
        revenue,
        conversionRate: sessions > 0 ? purchasers / sessions : 0,
        avgOrderValue: orders > 0 ? revenue / orders : 0
      };
    });

    return {
      startDate,
      endDate,
      grain,
      points
    };
  } finally {
    client.release();
  }
}

module.exports = { getTimeseries };
