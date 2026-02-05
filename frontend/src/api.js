const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function fetchOverview(startDate, endDate) {
  const res = await fetch(
    `${API_BASE_URL}/api/overview?startDate=${startDate}&endDate=${endDate}`
  );
  if (!res.ok) throw new Error(`Overview failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function fetchTimeseries(startDate, endDate, grain = "week") {
  const res = await fetch(
    `${API_BASE_URL}/api/overview/timeseries?startDate=${startDate}&endDate=${endDate}&grain=${grain}`
  );
  if (!res.ok) throw new Error(`Timeseries failed: ${res.status} ${await res.text()}`);
  return res.json();
}
