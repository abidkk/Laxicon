// ===== How to Talk to Anyone — data layer =====

function splitPipe(str) {
  if (!str) return [];
  return str.split("|").map((s) => s.trim()).filter(Boolean);
}

function splitComma(str) {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

function normalizeTrickRow(row) {
  return {
    trick: row["title"]?.trim() || "",
    concept: row["concept"]?.trim() || "",
    howItWorks: splitPipe(row["how_it_works ( spareated by | )"]),
    howToApply: splitPipe(row["how_to_apply ( spareated by | )"]),
    commonMistakes: splitPipe(row["common_mistakes ( spareated by | )"]),
    practiceTip: splitPipe(row["practice_tip"]),
    clips: splitComma(row["observation_clips ( coma saparated )"]),
  };
}

async function fetchTricks() {
  const res = await fetch(HTTA_CONFIG.CSV_URL);
  if (!res.ok) throw new Error("Could not load sheet (check sharing settings & Sheet ID)");
  const csvText = await res.text();
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  return parsed.data
    .map(normalizeTrickRow)
    .filter((t) => t.trick);
}