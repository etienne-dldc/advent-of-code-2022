export function getDays() {
  const today = new Date();
  if (today.getFullYear() !== 2022) {
    return range(24);
  }
  return range(today.getMonth() === 11 ? today.getDate() : 24);
}

function range(end: number) {
  return Array.from({ length: end }, (_, i) => i + 1);
}
