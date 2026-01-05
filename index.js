import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.json({ reply: "Message missing" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(userMessage);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.json({ reply: "No response from AI" });
  }
});

app.listen(10000, () => {
  console.log("Smart AI Backend running on port 10000");
});
