export function generateCode(length = 6): string {
  return Math.random().toString().slice(2, 2 + length);
}