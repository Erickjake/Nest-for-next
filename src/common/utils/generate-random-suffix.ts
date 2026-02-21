export function generateRandomSuffix(length: number = 7) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}
