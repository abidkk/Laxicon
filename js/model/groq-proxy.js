// ===== Oráculo Groq proxy (Cloudflare Worker) =====
// Deploy this separately at Cloudflare (free tier — no cost).
// Steps:
//   1. https://dash.cloudflare.com -> Workers & Pages -> Create Worker
//   2. Paste this code in.
//   3. Settings -> Variables -> add secret: GROQ_API_KEY (get a free key at console.groq.com)
//   4. Update ALLOWED_ORIGIN below to your GitHub Pages URL.
//   5. Deploy. Copy the worker's URL into js/oraculo-config.js -> WORKER_URL.

const ALLOWED_ORIGINS = [
  "https://abidkk.github.io",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const { question, context } = await request.json();

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are Oráculo, the assistant for a personal knowledge site called Laxicon. " +
                "If the user greets you, thanks you, or makes small talk, respond warmly and briefly — " +
                "no need to mention 'the notes' for these. " +
                "For factual questions, answer ONLY using the provided context. If the context doesn't contain " +
                "the answer, say you don't have that in the site's notes yet — don't guess or use outside knowledge. " +
                "Be concise and direct.",
            },
            {
              role: "user",
              content: `Context:\n${context}\n\nQuestion: ${question}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 600,
        }),
      });

      const data = await groqRes.json();
      const answer = data.choices?.[0]?.message?.content || "No response.";

      return new Response(JSON.stringify({ answer }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};


// // ===== Oráculo Groq proxy (Cloudflare Worker) =====
// // Deploy this separately at Cloudflare (free tier — no cost).
// // Steps:
// //   1. https://dash.cloudflare.com -> Workers & Pages -> Create Worker
// //   2. Paste this code in.
// //   3. Settings -> Variables -> add secret: GROQ_API_KEY (get a free key at console.groq.com)
// //   4. Update ALLOWED_ORIGIN below to your GitHub Pages URL.
// //   5. Deploy. Copy the worker's URL into js/oraculo-config.js -> WORKER_URL.

// const ALLOWED_ORIGIN = "https://abidkk.github.io"; // <-- change this

// export default {
//   async fetch(request, env) {
//     const corsHeaders = {
//       "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
//       "Access-Control-Allow-Methods": "POST, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type",
//     };

//     if (request.method === "OPTIONS") {
//       return new Response(null, { headers: corsHeaders });
//     }
//     if (request.method !== "POST") {
//       return new Response("Method not allowed", { status: 405, headers: corsHeaders });
//     }

//     try {
//       const { question, context } = await request.json();

//       const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${env.GROQ_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "llama-3.1-8b-instant",
//           messages: [
//             {
//               role: "system",
//               content:
//                 "You are Oráculo, the assistant for a personal knowledge site called Laxicon. " +
//                 "Answer ONLY using the provided context. If the context doesn't contain the answer, " +
//                 "say you don't have that in the site's notes yet. Be concise and direct.",
//             },
//             {
//               role: "user",
//               content: `Context:\n${context}\n\nQuestion: ${question}`,
//             },
//           ],
//           temperature: 0.3,
//         }),
//       });

//       const data = await groqRes.json();
//       const answer = data.choices?.[0]?.message?.content || "No response.";

//       return new Response(JSON.stringify({ answer }), {
//         headers: { ...corsHeaders, "Content-Type": "application/json" },
//       });
//     } catch (err) {
//       return new Response(JSON.stringify({ error: err.message }), {
//         status: 500,
//         headers: { ...corsHeaders, "Content-Type": "application/json" },
//       });
//     }
//   },
// };
