// ===== Laxicon config =====
// 1. Open your Google Sheet -> Share -> "Anyone with the link" -> Viewer.
// 2. Copy the Sheet ID from the URL:
//    https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit#gid=GID_HERE
// 3. Paste SHEET_ID below. GID is usually 0 unless you use another tab.
const CONFIG = {
  SHEET_ID: "1rjU7_3g1ncUU_7k4WG4jXeMB6c_Cu0uCDt3vYNlJ3-w",
  GID: "1904929078",
};

CONFIG.CSV_URL = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.GID}`;