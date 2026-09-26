import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getLevelById, getSanitizedLevel, LEVELS } from "./data/levels.js";
import { evaluatePlayerInput } from "./services/aiService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Dream Logic Server operational" });
});

// Get sanitized level details
app.get("/api/game/level/:id", (req, res) => {
  const levelId = Number(req.params.id);
  const sanitized = getSanitizedLevel(levelId);
  if (!sanitized) {
    return res.status(404).json({ error: "Level not found" });
  }
  res.json(sanitized);
});

// Interact API
app.post("/api/game/interact", async (req, res) => {
  try {
    const { levelId, playerInput } = req.body;

    // Validate inputs
    if (levelId === undefined || levelId === null) {
      return res.status(400).json({
        success: false,
        response: "The dream loses cohesion. Invalid level parameter."
      });
    }

    const inputStr = typeof playerInput === "string" ? playerInput.trim() : "";
    
    // For level 5, empty input or waiting is allowed. For other levels, check length limits.
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

    // Process evaluation via AI service
    const evaluation = await evaluatePlayerInput(level, inputStr);

    // Securely return ONLY success status and atmospheric response
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

// Serve frontend static build in production
const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendDist, "index.html"), (err) => {
      if (err) {
        res.status(200).send("Dream Logic Backend API Running");
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Dream Logic] Server running on http://localhost:${PORT}`);
});
