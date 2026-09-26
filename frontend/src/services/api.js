const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Send player input to backend for AI judgment against hidden rule.
 */
export async function interactWithGame(levelId, playerInput) {
  try {
    const response = await fetch(`${API_BASE_URL}/game/interact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        levelId,
        playerInput,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        response: errorData.response || "The dream flickers softly. The world did not respond.",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("API interaction error:", error);
    return {
      success: false,
      response: "The dream has gone quiet. Try again.",
    };
  }
}

/**
 * Fetch level details (sanitized, server-side rule removed).
 */
export async function fetchLevel(levelId) {
  try {
    const response = await fetch(`${API_BASE_URL}/game/level/${levelId}`);
    if (!response.ok) throw new Error("Failed to load level");
    return await response.json();
  } catch (error) {
    console.error("Error fetching level:", error);
    return null;
  }
}
