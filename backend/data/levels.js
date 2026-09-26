export const LEVELS = [
  {
    id: 1,
    title: "THE LISTENING DOOR",
    scene: "A door stands before you, humming faintly.\n\nIt seems to be listening.",
    secretRule: "The door only opens when the player lies to it.",
    hintTheme: "truth and deception"
  },
  {
    id: 2,
    title: "THE MIRROR",
    scene: "A mirror hangs in an empty room.\n\nYour reflection is looking somewhere else.",
    secretRule: "The player must say something that is true about the reflection but false about themselves.",
    hintTheme: "perspective and reflection"
  },
  {
    id: 3,
    title: "THE CAT",
    scene: "A white cat sits in the middle of the hallway.\n\nIt refuses to look at you.",
    secretRule: "The player must address the cat without explicitly mentioning the cat or using words like 'cat', 'feline', 'kitty', 'pet', 'animal'.",
    hintTheme: "indirect address"
  },
  {
    id: 4,
    title: "THE CLOCK",
    scene: "A clock hangs on the wall.\n\nIt has no hands.\n\nYet somehow, it is ticking.",
    secretRule: "The player must ask a question that cannot meaningfully be answered.",
    hintTheme: "paradoxical questions"
  },
  {
    id: 5,
    title: "THE ROOM THAT WAITS",
    scene: "You enter an empty room.\n\nNothing moves.\n\nNothing speaks.\n\nNothing changes.\n\nA message appears:\n\nWHAT WILL YOU DO?",
    secretRule: "The player must intentionally take no action, wait, remain still, or express total inaction.",
    hintTheme: "silence and inaction"
  }
];

export function getLevelById(id) {
  return LEVELS.find((level) => level.id === Number(id));
}

export function getSanitizedLevel(id) {
  const level = getLevelById(id);
  if (!level) return null;
  // Return ONLY non-secret data to frontend
  return {
    id: level.id,
    title: level.title,
    scene: level.scene,
  };
}
