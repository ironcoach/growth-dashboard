const express = require("express");
const { getTimeseries } = require("../services/timeseries.service");

const router = express.Router();

// GET /api/overview/timeseries?startDate=2025-01-01&endDate=2025-12-31&grain=week
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate, grain = "week" } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "startDate and endDate are required (YYYY-MM-DD)."
      });
    }

    const data = await getTimeseries(startDate, endDate, grain);
    return res.json(data);
  } catch (err) {
    console.error("Timeseries route error:", err.message);
    if (err.message.startsWith("Invalid")) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
