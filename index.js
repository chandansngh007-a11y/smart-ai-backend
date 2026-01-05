import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Gemini API key (Render Environment Variable)
const GEMINI_KEY = process.env.GEMINI;

// 🔎 Debug (Render logs me true aana chahiye)
console.log("GEMINI key loaded:", !!GEMINI_KEY);

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ status: "Smart AI Backend is running 🚀" });
});

// ✅ Chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Message missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.json({ reply });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ reply: "AI error occurred" });
  }
});

// ✅ Render PORT handling
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Smart AI Backend running on port ${PORT}`);
});
