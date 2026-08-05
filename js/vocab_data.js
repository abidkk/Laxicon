// ===== Laxicon vocab data layer =====
// Fetches the published Google Sheet as CSV and normalizes rows.

function splitList(str) {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

function normalizeRow(row) {
  return {
    word: row["word-Phrase"]?.trim() || "",
    meaning: row["Defnition-Meaining"]?.trim() || "",
    pos: row["Parts-of-speach"]?.trim() || "",
    synonyms: splitList(row["Synonyms  ( Coma separated )"]),
    antonyms: splitList(row["Antonyms ( Coma  separated  )"]),
    exactSentence: row["Exact-Senetence"]?.trim() || "",
    synSentence: row["Syn-Sentence"]?.trim() || "",
    antSentence: row["Ant-Sentence"]?.trim() || "",
    commonSentences: (row["Common-Sentences  ( separated by  | )"] || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

async function fetchVocab() {
  const res = await fetch(CONFIG.CSV_URL);
  if (!res.ok) throw new Error("Could not load sheet (check sharing settings & Sheet ID)");
  const csvText = await res.text();
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  return parsed.data
    .map(normalizeRow)
    .filter((r) => r.word)
    .sort((a, b) => a.word.localeCompare(b.word));
}