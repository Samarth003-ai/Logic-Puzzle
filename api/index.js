import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getLevelById, getSanitizedLevel } from "../backend/data/levels.js";
import { evaluatePlayerInput } from "../backend/services/aiService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Dream Logic Server operational" });
});

// Sanitized level details
app.get("/api/game/level/:id", (req, res) => {
  const levelId = Number(req.params.id);
  const sanitized = getSanitizedLevel(levelId);
  if (!sanitized) {
    return res.status(404).json({ error: "Level not found" });
  }
  res.json(sanitized);
});

// Game interaction route
app.post("/api/game/interact", async (req, res) => {
  try {
    const { levelId, playerInput } = req.body;

    if (levelId === undefined || levelId === null) {
      return res.status(400).json({
        success: false,
        response: "The dream loses cohesion. Invalid level parameter."
      });
    }

    const inputStr = typeof playerInput === "string" ? playerInput.trim() : "";
    
    if (inputStr.length > 500) {
      return res.status(400).json({
        success: false,
        response: "Your words overflow into noise. Keep your input under 500 characters."
      });
    }

    const level = getLevelById(levelId);
    if (!level) {
      return res.status(404).json({
        success: false,
        response: "You step into non-existence. Level not found."
      });
    }

    const evaluation = await evaluatePlayerInput(level, inputStr);

    return res.json({
      success: evaluation.success,
      response: evaluation.response
    });
  } catch (err) {
    console.error("[Server Error]", err);
    return res.status(500).json({
      success: false,
      response: "The dream has gone quiet. Try again."
    });
  }
});

export default app;
