# DREAM LOGIC

> **"Some worlds only make sense when you stop making sense."**

A production-quality surreal natural-language puzzle game powered by Google Gemini AI and built with React, Vite, Tailwind CSS, Framer Motion, and Node.js.

### 🌐 Live Links
- **Live Demo**: [https://dream-inference-lab.preview.emergentagent.com/](https://dream-inference-lab.preview.emergentagent.com/)
- **GitHub Repository**: [https://github.com/Samarth003-ai/dream-logic](https://github.com/Samarth003-ai/dream-logic)
- **Local Running Server**: `http://localhost:3001`

---


## 1. Concept

**DREAM LOGIC** is a short interactive fiction puzzle game set in a surreal dreamscape. 

Unlike traditional games with rigid button choices or fixed command parsers (like "open door" or "use key"), **DREAM LOGIC** allows the player to type completely free-form natural language:
- Questions
- Commands
- Lies & Paradoxes
- Observations & Strange sentences
- Creative poetic attempts

Each level contains **ONE hidden semantic rule**. The rule is never exposed to the frontend or revealed explicitly. The player must reverse-engineer the hidden logic of the dream through experimentation.

---

## 2. Why AI is Necessary

Traditional game engines rely on exact keyword matching or predefined decision trees. **DREAM LOGIC** requires true semantic reasoning:

- **Semantic Intent Evaluation**: In Level 1 (*The Listening Door*), the hidden rule requires the player to *lie*. A keyword parser cannot determine if `"You are already open"` or `"There is no door here"` or `"I am a ghost"` are semantically equivalent lies. Google Gemini evaluates the deep meaning behind any creative sentence.
- **In-Character Hints**: When a player fails an attempt, Gemini generates a subtle, atmospheric in-world reaction (e.g., *"The humming continues."* or *"The reflection turns away."*) rather than a generic error message, encouraging creative exploration without spoiling the secret rule.

---

## 3. The 5 Hidden Puzzle Rules

1. **Level 1 — THE LISTENING DOOR**
   - **Scene**: *"A door stands before you, humming faintly. It seems to be listening."*
   - **Secret Rule**: The door only opens when the player lies to it.
2. **Level 2 — THE MIRROR**
   - **Scene**: *"A mirror hangs in an empty room. Your reflection is looking somewhere else."*
   - **Secret Rule**: The player must say something that is true about the reflection but false about themselves.
3. **Level 3 — THE CAT**
   - **Scene**: *"A white cat sits in the middle of the hallway. It refuses to look at you."*
   - **Secret Rule**: The player must address the cat without explicitly mentioning the cat or using forbidden words (`cat`, `feline`, `kitty`, `pet`).
4. **Level 4 — THE CLOCK**
   - **Scene**: *"A clock hangs on the wall. It has no hands. Yet somehow, it is ticking."*
   - **Secret Rule**: The player must ask a question that cannot meaningfully be answered (an unanswerable paradox).
5. **Level 5 — THE ROOM THAT WAITS**
   - **Scene**: *"You enter an empty room. Nothing moves. Nothing speaks. Nothing changes. WHAT WILL YOU DO?"*
   - **Secret Rule**: The player must intentionally take no action or remain still.

---

## 4. Architecture & Security

```
├── backend/
│   ├── data/levels.js            # Secure server-side level definitions & hidden rules
│   ├── services/aiService.js     # Google Gemini API integration & structured JSON evaluation
│   └── server.js                 # Express server & API routes
└── frontend/
    ├── src/
    │   ├── components/           # HomeScreen, GameScreen, SuccessModal, EndingScreen, etc.
    │   ├── hooks/useGameState.js  # React state + LocalStorage persistence
    │   └── services/audioService.js # Procedural Web Audio API synthesizer
    ├── index.html
    └── vite.config.js
```

### Security Principles
- **Hidden rules stay server-side**: Secret rules are stored exclusively in `backend/data/levels.js` and never transmitted in API responses.
- **API Key protection**: `GEMINI_API_KEY` is loaded via backend environment variables and is never present in frontend client bundles.
- **Structured output validation**: All model outputs are strictly parsed and sanitized before reaching the player.

---

## 5. Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js, Cors, Dotenv
- **AI Integration**: Google Gemini API (`@google/generative-ai`)
- **Sound**: Procedural Web Audio API Synthesizer (Zero external audio file dependencies)

---

## 6. Prompt Engineering Approach

The backend uses a system prompt template enforcing 13 critical rules:
1. Never reveal the secret rule.
2. Never tell the player how to solve the level.
3. Never use terms like `'secret rule'`, `'solution'`, or `'correct answer'`.
4. Judge semantic intent rather than keyword matching.
5. Stay in character (surreal, mysterious, short).
6. Return structured JSON only (`{ "success": boolean, "response": string, "confidence": number }`).

---

## 7. API Architecture

### `POST /api/game/interact`

**Request**:
```json
{
  "levelId": 1,
  "playerInput": "You are already open."
}
```

**Response**:
```json
{
  "success": true,
  "response": "The humming ceases. The heavy iron latch clicks open of its own accord."
}
```

---

## 8. Local Setup & Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Samarth003-ai/dream-logic.git
   cd dream-logic
   ```

2. **Install dependencies**:
   ```bash
   npm install
   npm run install --prefix frontend
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   PORT=3001
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build & Run Production Server**:
   ```bash
   npm run build
   npm start
   ```
   Open `http://localhost:3001` in your browser.

---

## 9. Future Improvements

- Multiplayer dream co-op (shared input sessions)
- Custom level editor for community dream creation
- Voice input / speech-to-text integration for spoken natural-language interaction

---

## 10. License

MIT License. Designed and developed by Samarth.
