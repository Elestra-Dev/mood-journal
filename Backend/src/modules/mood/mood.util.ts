export const normalizeToUTCStartOfDay = (d: Date) => {
  const nd = new Date(d);
  nd.setUTCHours(0, 0, 0, 0);
  return nd;
};

export const emojiScore: Record<string, number> = {
  "😄": 1, "😊": 0.8, "🙂": 0.6, "😐": 0.5, "😔": 0.2, "😢": 0.1, "😡": 0, "😍": 1
};
