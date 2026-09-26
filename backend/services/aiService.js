import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are the hidden puzzle judge for DREAM LOGIC, a surreal interactive fiction puzzle game.

You receive:
- CURRENT SCENE
- SECRET RULE
- PLAYER INPUT
- LEVEL NUMBER

Your task is to determine whether the player's input satisfies the secret rule.

CRITICAL EVALUATION RULES:
1. Never reveal the secret rule.
2. Never explicitly tell the player how to solve the level.
3. Never use the words 'secret rule', 'solution', 'rule', or 'correct answer' in player-facing responses.
4. Judge semantic intent rather than exact keyword matching.
5. Accept creative phrasing when it genuinely satisfies the secret rule.
6. Reject attempts that merely contain keywords without satisfying the intended condition.
7. Stay deeply in character: mysterious, surreal, dreamlike, calm.
8. Responses must be short (1-2 sentences maximum), atmospheric, and evocative.
9. Never break the fourth wall.
10. Never mention being an AI, LLM, or software.
11. Never expose internal reasoning or confidence scores in player-facing text.
12. Return structured JSON ONLY.

JSON SCHEMA:
{
  "success": boolean,
  "response": string,
  "confidence": number
}`;

/**
 * Fallback evaluator if Gemini API key is missing or fails repeatedly.
 */
function evaluateFallback(level, playerInput) {
  const inputLower = (playerInput || "").trim().toLowerCase();

  if (level.id === 1) {
    // Secret Rule: The door only opens when the player lies to it.
    // e.g. "You are open", "I am already inside", "There is no door", "You are closed", "I am a ghost", "The sky is green"
    const lieKeywords = ["already open", "no door", "you are open", "unlocked", "i am inside", "i'm inside", "open now", "never locked", "already inside", "you are not a door"];
    const isLie = lieKeywords.some(k => inputLower.includes(k)) || (inputLower.length > 5 && !inputLower.includes("please") && !inputLower.includes("open the door"));
    
    if (isLie) {
      return {
        success: true,
        response: "The humming ceases. The heavy iron latch clicks open of its own accord."
      };
    }
    return {
      success: false,
      response: "The door continues its low, rhythmic hum. It remains impassive."
    };
  }

  if (level.id === 2) {
    // Secret Rule: Player must say something true about the reflection but false about themselves.
    // e.g. "You are looking away", "You see something else", "Your eyes are turned left", "You are staring behind me"
    const mirrorKeywords = ["looking away", "looking somewhere else", "staring behind", "turned away", "not looking at me", "facing away", "gazing elsewhere"];
    const isSuccess = mirrorKeywords.some(k => inputLower.includes(k));

    if (isSuccess) {
      return {
        success: true,
        response: "The reflection slowly turns back, its outline shimmering like disturbed water."
      };
    }
    return {
      success: false,
      response: "The figure in the glass maintains its quiet, distant gaze."
    };
  }

  if (level.id === 3) {
    // Secret Rule: Address the cat without explicitly mentioning 'cat', 'feline', 'kitty', etc.
    const forbidden = ["cat", "feline", "kitty", "kitten", "pet", "animal", "meow"];
    const containsForbidden = forbidden.some(w => inputLower.includes(w));
    const addressesCreature = inputLower.length > 3 && (inputLower.includes("you") || inputLower.includes("hello") || inputLower.includes("small") || inputLower.includes("soft") || inputLower.includes("whisker") || inputLower.includes("friend") || inputLower.includes("creature") || inputLower.includes("little one"));

    if (!containsForbidden && addressesCreature) {
      return {
        success: true,
        response: "The small white creature turns its head towards you and blinks slowly."
      };
    }
    return {
      success: false,
      response: "The white form remains still, ears twitching faintly in the corridor silence."
    };
  }

  if (level.id === 4) {
    // Secret Rule: Ask a question that cannot meaningfully be answered.
    // e.g. "What color is silence?", "Where does yesterday go?", "Why is a raven like a writing desk?", "What is the shape of time?"
    const isQuestion = inputLower.includes("?") || inputLower.startsWith("what") || inputLower.startsWith("why") || inputLower.startsWith("where") || inputLower.startsWith("how");
    const paradoxWords = ["silence", "time", "yesterday", "tomorrow", "nothing", "forever", "nowhere", "color of", "shape of", "weight of", "sound of"];
    const isParadox = paradoxWords.some(w => inputLower.includes(w));

    if (isQuestion && (isParadox || inputLower.length > 15)) {
      return {
        success: true,
        response: "The ticking shudders to a halt. The clock face dissolves into warm light."
      };
    }
    return {
      success: false,
      response: "The steady, rhythmic ticking continues uninterrupted."
    };
  }

  if (level.id === 5) {
    // Secret Rule: Intentionally take no action.
    const waitKeywords = ["wait", "nothing", "do nothing", "remain still", "stay still", "stand still", "silence", "pause", "stop", "action", "listen", "breathe", "hold still"];
    const isWait = waitKeywords.some(w => inputLower.includes(w)) || inputLower === "" || inputLower === ".";

    if (isWait) {
      return {
        success: true,
        response: "The room exhales. The stillness accepts you."
      };
    }
    return {
      success: false,
      response: "The room waits in absolute silence, untouched by your movement."
    };
  }

  return {
    success: false,
    response: "The dream remains still."
  };
}

export async function evaluatePlayerInput(level, playerInput) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_key_here" || apiKey.trim() === "") {
    console.log("[AI Service] GEMINI_API_KEY missing or placeholder. Using intelligent fallback evaluator.");
    return evaluateFallback(level, playerInput);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-1.5-flash or gemini-2.5-flash
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const prompt = `CURRENT SCENE:
"${level.scene}"

SECRET RULE:
"${level.secretRule}"

PLAYER INPUT:
"${playerInput}"

LEVEL NUMBER:
${level.id}

Evaluate the player's input against the secret rule and return the JSON response.`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      if (typeof parsed.success === "boolean" && typeof parsed.response === "string") {
        return {
          success: parsed.success,
          response: parsed.response,
        };
      }
    } catch (err) {
      console.warn(`[AI Service] Attempt ${attempt} failed:`, err.message);
    }
  }

  console.warn("[AI Service] Gemini response invalid after retry. Falling back to rule engine.");
  return evaluateFallback(level, playerInput);
}
