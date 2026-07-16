// */*/*/*/*/*?**/*/*/*/*/*/*/*?*??*?8*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?**/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/



// this setup for google gemini embedding api, but it is not working, so I am commenting it out for now. I will come back to it later when
//  I have more time to debug it.



// */*/*/*/*/*?**/*/*/*/*/*/*/*?*??*?8*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?*?**/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/
export const generateEmbedding = async (text) => {
  // Guard clause: stop if text is empty
  if (!text || text.trim() === "") {
    console.error("❌ EMBEDDING ERROR: No text provided to embed.");
    return [];
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { 
          parts: [{ text: text }] // Explicitly mapping text to the text field
        },
        outputDimensionality: 768 
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("API returned error:", JSON.stringify(data.error, null, 2));
      throw new Error(data.error.message);
    }

    return data.embedding.values;
  } catch (error) {
    console.error("❌ EMBEDDING ERROR:", error.message);
    return [];
  }
};
