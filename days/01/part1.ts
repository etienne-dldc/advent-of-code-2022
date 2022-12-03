export {};

const input = await Deno.readTextFile("./input.txt");

const elves = input
  .split("\n\n")
  .map((elf) =>
    elf
      .split("\n")
      .filter((v) => v.trim().length > 0)
      .map((v) => parseInt(v, 10))
  )
  .filter((v) => v.length > 0);

const elvesTotal = elves.map((elf) => elf.reduce((a, b) => a + b, 0));

console.log({ max: Math.max(...elvesTotal) });
