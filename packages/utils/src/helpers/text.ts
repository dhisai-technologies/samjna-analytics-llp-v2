export function generateRandomName(): string {
  const adjectives = ["Mighty", "Brave", "Invisible", "Mysterious", "Silent", "Ancient", "Furious", "Legendary"];
  const nouns = ["Explorer", "Guardian", "Wanderer", "Sorcerer", "Ranger", "Paladin", "Seeker", "Adventurer"];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);

  return `${adjective}-${noun}-${number}`;
}

export function generateRandomText(
  words = ["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"],
  numberOfLines = 1,
): string {
  let randomText = "";

  for (let i = 0; i < numberOfLines; i++) {
    const lineLength = Math.floor(Math.random() * 10) + 5; // Random line length between 5 and 15 words
    let line = "";
    for (let j = 0; j < lineLength; j++) {
      const wordIndex = Math.floor(Math.random() * words.length);
      line += `${words[wordIndex]} `;
    }
    randomText += `${line.trim()}\n`;
  }

  return randomText.trim();
}

export function speakText(text: string) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = resolve;
    synth.speak(utterance);
  });
}
