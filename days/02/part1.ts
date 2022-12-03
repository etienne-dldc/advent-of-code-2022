export {};

const input = await Deno.readTextFile("./input.txt");

let score = 0;

const play = {
  // Rock 1
  AX: 1 + 3,
  AY: 2 + 6,
  AZ: 3 + 0,
  // Paper 2
  BX: 1 + 0,
  BY: 2 + 3,
  BZ: 3 + 6,
  // Scissors 3
  CX: 1 + 6,
  CY: 2 + 0,
  CZ: 3 + 3,
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
