// ===== Oráculo — knowledge aggregation =====
// Pulls from your existing fetch functions (already loaded by config/data scripts
// on this page) and normalizes everything into flat text chunks for retrieval.
// Each chunk: { id, text, title, source, url }

async function buildCorpus() {
  const chunks = [];
  let id = 0;

  // Vocab
  if (typeof fetchVocab === "function") {
    try {
      const words = await fetchVocab();
      words.forEach((w) => {
        chunks.push({
          id: id++,
          title: w.word,
          source: "Vocab",
          url: "vocab.html",
          text: [
            `Word: ${w.word}`,
            w.pos ? `Part of speech: ${w.pos}` : "",
            `Meaning: ${w.meaning}`,
            w.synonyms.length ? `Synonyms: ${w.synonyms.join(", ")}` : "",
            w.antonyms.length ? `Antonyms: ${w.antonyms.join(", ")}` : "",
            w.exactSentence ? `Example: ${w.exactSentence}` : "",
          ].filter(Boolean).join("\n"),
        });
      });
    } catch (e) { console.warn("Oráculo: vocab skipped", e); }
  }

  // Marginalia
  if (typeof fetchMarginalia === "function") {
    try {
      const entries = await fetchMarginalia();
      entries.forEach((m) => {
        chunks.push({
          id: id++,
          title: m.title,
          source: "Marginalia",
          url: "marginalia.html",
          text: [
            `Concept: ${m.title}`,
            m.source ? `Book/Source: ${m.source}` : "",
            m.category ? `Category: ${m.category}` : "",
            m.coreIdea ? `Core idea: ${m.coreIdea}` : "",
            m.description ? `Notes: ${m.description}` : "",
            m.tags.length ? `Tags: ${m.tags.join(", ")}` : "",
          ].filter(Boolean).join("\n"),
        });
      });
    } catch (e) { console.warn("Oráculo: marginalia skipped", e); }
  }

  // How to Talk to Anyone — tricks
  if (typeof fetchTricks === "function") {
    try {
      const tricks = await fetchTricks();
      tricks.forEach((t) => {
        chunks.push({
          id: id++,
          title: t.trick,
          source: "How to Talk to Anyone",
          url: "howtotalk.html",
          text: [
            `Trick: ${t.trick}`,
            `Concept: ${t.concept}`,
            t.howItWorks.length ? `How it works: ${t.howItWorks.join(" ")}` : "",
            t.howToApply.length ? `How to apply: ${t.howToApply.join(" ")}` : "",
            t.commonMistakes.length ? `Common mistakes: ${t.commonMistakes.join(" ")}` : "",
          ].filter(Boolean).join("\n"),
        });
      });
    } catch (e) { console.warn("Oráculo: tricks skipped", e); }
  }

  // Archivo — docs (title/description only, files aren't readable text)
  if (typeof fetchDocs === "function") {
    try {
      const docs = await fetchDocs();
      docs.forEach((d) => {
        chunks.push({
          id: id++,
          title: d.title,
          source: "Archivo",
          url: "archivo.html",
          text: [
            `Document: ${d.title}`,
            d.category ? `Category: ${d.category}` : "",
            d.description ? `Description: ${d.description}` : "",
          ].filter(Boolean).join("\n"),
        });
      });
    } catch (e) { console.warn("Oráculo: archivo skipped", e); }
  }

  return chunks;
}
