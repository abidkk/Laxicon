// ===== Marginalia config =====
// Same setup as js/config.js — separate sheet, separate constant name
// so both features can run on the same site without clashing.
const MARGINALIA_CONFIG = {
  SHEET_ID: "11kzTiVetw4D4J6Y-1pRcdovtPfZXnpgU9Zd2NOZ3WCo",
  GID: "1650607354",
};

MARGINALIA_CONFIG.CSV_URL = `https://docs.google.com/spreadsheets/d/${MARGINALIA_CONFIG.SHEET_ID}/export?format=csv&gid=${MARGINALIA_CONFIG.GID}`;