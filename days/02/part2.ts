export {};

const input = await Deno.readTextFile("./input.txt");

let score = 0;

// X means you need to lose
// Y means you need to end the round in a draw,
// Z means you need to win. Good luck!"

const play = {
  // Rock 1
  AX: 0 + 3,
  AY: 3 + 1,
  AZ: 6 + 2,
  // Paper 2
  BX: 0 + 1,
  BY: 3 + 2,
  BZ: 6 + 3,
  // Scissors 3
  CX: 0 + 2,
  CY: 3 + 3,
  CZ: 6 + 1,
};

input
  .split("\n")
  .filter((v) => v.trim().length > 0)
  .map((v) => v.split(" "))
  .forEach(([left, right]) => {
    const l = left as "A" | "B" | "C";
    const r = right as "X" | "Y" | "Z";
    score += play[`${l}${r}`];
  });

console.log({ score });
