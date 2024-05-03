export function getRandomHash(length: number) {
  const letters = "abcdefghijklmnopqrstuvwxyz1234567890-_";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }
  return result;
}
