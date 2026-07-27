// ===== Marginalia data layer =====

function splitTags(str) {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

function normalizeMarginaliaRow(row) {
  return {
    title: row["Title"]?.trim() || "",
    source: row["Source"]?.trim() || "",
    category: row["Category"]?.trim() || "",
    coreIdea: row["Core-Idea"]?.trim() || "",
    description: row["Description"]?.trim() || "",
    description2: row["Description 2"]?.trim() || "",
    tags: splitTags(row["Tags"]),
  };
}

async function fetchMarginalia() {
  const res = await fetch(MARGINALIA_CONFIG.CSV_URL);
  if (!res.ok) throw new Error("Could not load sheet (check sharing settings & Sheet ID)");
  const csvText = await res.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return parsed.data
    .map(normalizeMarginaliaRow)
    .filter((r) => r.title)
    .reverse(); // newest first
}
