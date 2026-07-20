import Event from "../models/eventModel.js";
import { generateEmbedding } from "../utils/embedding.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("🚀 chatController loaded");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing!");
} else {
  console.log("✅ GEMINI_API_KEY found");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
console.log("✅ GoogleGenerativeAI initialized");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
console.log("✅ Gemini model loaded");

export const chatWithAI = async (req, res) => {
  try {
    console.log("📥 Request Body:", req.body);

    const { query } = req.body;

    console.log("📝 Query:", query);

    if (!query) {
      console.log("❌ Query missing");

      return res.status(400).json({
        error: "Query is missing",
      });
    }

    const totalEvents = await Event.countDocuments();

    const allEvents = await Event.find();

    allEvents.forEach((event, index) => {
      console.log(`Event ${index + 1}`);
      console.log("Title:", event.title);
      console.log("Has Embedding:", !!event.embedding);
      console.log("------------------------");
    });

    // ============================
    // EMBEDDING
    // ============================
    const queryEmbedding = await generateEmbedding(query);

    // ============================
    // VECTOR SEARCH
    // ============================

    console.log("🔍 Starting Vector Search...");

    const events = await Event.aggregate([
      {
        $vectorSearch: {
          index: "default",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 150,
          limit: 3,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          location: 1,
          category: 1,
          embedding: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    if (events.length === 0) {
      console.log("❌ VECTOR SEARCH RETURNED ZERO RESULTS");

      return res.json({
        answer: "No matching events found.",
      });
    }

    const context = events
      .map(
        (e) => `
Title: ${e.title}
Description: ${e.description}
Location: ${e.location}
Category: ${e.category}
`,
      )
      .join("\n");

    // ============================
    // PROMPT
    // ============================

    console.log("📝 Building Prompt...");

    const prompt = `
You are an AI assistant for an Event Management System.

Answer ONLY using the context below.

If the answer is not present, say:

"I couldn't find that information."

Context:

${context}

Question:

${query}
`;

    console.log("✅ Prompt Created");

    console.log(prompt);

    // ============================
    // GEMINI
    // ============================

    console.log("🤖 Sending Prompt to Gemini...");

    const result = await model.generateContent(prompt);

    console.log("✅ Gemini Response Received");

    console.dir(result, {
      depth: null,
    });

    const answer = result.response.text();

    console.log("📢 Final Answer:");
    console.log(answer);

    console.log("✅ API Completed Successfully");

    return res.json({
      answer,
    });
  } catch (err) {
    console.log("=================================");
    console.log("❌ ERROR OCCURRED");
    console.log("=================================");

    console.error(err);

    console.log("Error Message:", err.message);

    console.log("Stack Trace:");

    console.error(err.stack);

    return res.status(500).json({
      error: err.message,
    });
  }
};
