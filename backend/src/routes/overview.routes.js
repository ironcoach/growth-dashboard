const express = require("express");
const { getOverview } = require("../services/overview.service");

const router = express.Router();

// GET /api/overview?startDate=2025-01-01&endDate=2025-12-31
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "startDate and endDate are required (YYYY-MM-DD)."
      });
    }

    const data = await getOverview(startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error("Overview route error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
