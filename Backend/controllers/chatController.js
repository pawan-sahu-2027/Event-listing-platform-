
import Event from "../models/EventModel.js";
import { generateEmbedding } from "../utils/embedding.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const chatWithAI = async (req, res) => {
 
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        error: "Query is missing",
      });
    }

    // ============================
    // DATABASE CHECK
    // ============================

    const totalEvents = await Event.countDocuments();

  

    const allEvents = await Event.find();

    // console.log("\n3️⃣ Checking Every Event:");

    // allEvents.forEach((event, index) => {
    //   console.log("--------------------------------");
    //   console.log(`Event ${index + 1}`);

    //   console.log("_id:", event._id);
    //   console.log("title:", event.title);
    //   console.log("description:", event.description);
    //   console.log("location:", event.location);
    //   console.log("category:", event.category);

    //   console.log(
    //     "embedding exists:",
    //     Array.isArray(event.embedding)
    //   );

    //   console.log(
    //     "embedding length:",
    //     event.embedding ? event.embedding.length : "NO EMBEDDING"
    //   );
    // });

    // ============================
    // QUERY EMBEDDING
    // ============================



    const queryEmbedding = await generateEmbedding(query);

  

    // ============================
    // VECTOR SEARCH
    // ============================


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
      console.log("\n❌ VECTOR SEARCH RETURNED ZERO RESULTS");

      return res.json({
        answer: "No matching events found.",
      });
    }

    

    events.forEach((event, index) => {
    
    });

    // ============================
    // CONTEXT
    // ============================

    const context = events
      .map(
        (e) => `
Title: ${e.title}
Description: ${e.description}
Location: ${e.location}
Category: ${e.category}
`
      )
      .join("\n");

  

    // ============================
    // PROMPT
    // ============================

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


  

    const result = await model.generateContent(prompt);

   
    console.dir(result, {
      depth: null,
    });

    const answer = result.response.text();


    return res.json({
      answer,
    });
  } catch (err) {
    console.error("\n❌ COMPLETE ERROR");
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
};