require("dotenv").config();

const express = require("express");
const cors = require("cors");

const overviewRoutes = require("./routes/overview.routes");
const timeseriesRoutes = require("./routes/timeseries.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/overview", overviewRoutes);
app.use("/api/overview/timeseries", timeseriesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
