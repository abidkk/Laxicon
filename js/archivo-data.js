// ===== Archivo — data layer =====

function normalizeDocRow(row) {
  return {
    title: row["Title"]?.trim() || "",
    description: row["Description ( Optional )"]?.trim() || "",
    category: row["Category"]?.trim() || "",
    link: row["File-Url"]?.trim() || "",
  };
}

async function fetchDocs() {
  const res = await fetch(ARCHIVO_CONFIG.CSV_URL);
  if (!res.ok) throw new Error("Could not load sheet (check sharing settings & Sheet ID)");
  const csvText = await res.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return parsed.data
    .map(normalizeDocRow)
    .filter((d) => d.title)
    .reverse(); // newest first
}
