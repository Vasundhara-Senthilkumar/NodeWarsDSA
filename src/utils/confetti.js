import confetti from 'canvas-confetti';

export const triggerVictoryConfetti = () => {
  try {
    // Left burst
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: { x: 0.1, y: 0.6 },
      colors: ['#5eead4', '#38bdf8', '#fbbf24', '#ffffff', '#2dd4bf']
    });

    // Right burst
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: { x: 0.9, y: 0.6 },
      colors: ['#5eead4', '#38bdf8', '#fbbf24', '#ffffff', '#2dd4bf']
    });

    // Center star blast
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#5eead4', '#fbbf24', '#ffffff', '#c084fc']
      });
    }, 250);
  } catch (err) {
    console.warn("Confetti effect skipped:", err);
  }
};
