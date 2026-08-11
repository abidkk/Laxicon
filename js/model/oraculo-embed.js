// ===== Oráculo — embedding & retrieval =====
// Uses Transformers.js (runs the model in-browser, no server, no cost).
// Embeddings + chunk text are cached in localStorage so repeat visits are instant
// until the underlying sheets change.

const ORACULO_CACHE_KEY = "oraculo_index_v1";
let embedderPipeline = null;

async function getEmbedder() {
  if (embedderPipeline) return embedderPipeline;
  const { pipeline } = await import(
    "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2"
  );
  embedderPipeline = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  return embedderPipeline;
}

function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function corpusFingerprint(chunks) {
  // Cheap hash: length + concatenated ids/text-lengths. Good enough to detect changes.
  return `${chunks.length}:${chunks.map((c) => c.text.length).join(",")}`;
}

async function embedText(text) {
  const embedder = await getEmbedder();
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

export async function buildOrLoadIndex(onProgress) {
  const chunks = await buildCorpus();
  const fingerprint = corpusFingerprint(chunks);

  const cached = localStorage.getItem(ORACULO_CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.fingerprint === fingerprint) {
        return { chunks: parsed.chunks, vectors: parsed.vectors };
      }
    } catch (e) { /* fall through to rebuild */ }
  }

  const vectors = [];
  for (let i = 0; i < chunks.length; i++) {
    onProgress?.(i + 1, chunks.length);
    vectors.push(await embedText(chunks[i].text));
  }

  localStorage.setItem(
    ORACULO_CACHE_KEY,
    JSON.stringify({ fingerprint, chunks, vectors })
  );
  return { chunks, vectors };
}

export async function retrieveTopK(query, index, k = 5) {
  const queryVec = await embedText(query);
  const scored = index.chunks.map((chunk, i) => ({
    chunk,
    score: cosineSim(queryVec, index.vectors[i]),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}
