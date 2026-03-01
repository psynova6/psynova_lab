
const mockResponses = [
  "I understand. It sounds like you're dealing with a lot right now. Could you tell me more about what's been happening?",
  "Thank you for sharing that. It's brave to talk about these feelings. I'm here to listen without judgment.",
  "That sounds really challenging. Remember to be kind to yourself. It's okay to feel this way.",
  "Sometimes just acknowledging our feelings is a big step. What's one small thing you could do for yourself today?",
  "I'm hearing that you feel overwhelmed. Have you considered any small grounding exercises, like focusing on your breath for a minute?",
  "It makes sense that you would feel that way given the circumstances. What support do you have around you right now?",
];

let responseIndex = 0;

export const sendMessageToMock = (message: string): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Simple logic to detect urgent keywords.
      if (/(suicide|kill myself|self-harm|hopeless)/i.test(message)) {
        resolve("It sounds like you are in a lot of pain. It's really important to talk to someone who can help right now. Please reach out to a crisis hotline or a mental health professional immediately. You are not alone.");
      } else {
        const response = mockResponses[responseIndex];
        responseIndex = (responseIndex + 1) % mockResponses.length;
        resolve(response);
      }
    }, 1000 + Math.random() * 500); // Simulate network latency
  });
};
