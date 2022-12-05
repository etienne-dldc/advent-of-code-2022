export {};

const input = await Deno.readTextFile("./input.txt");

const [cratesStr, movesStr] = input.split("\n\n");

const crates: Array<Array<string>> = [];

const crateLines = cratesStr
  .split("\n")
  .slice(0, -1)
  .map((line) => {
    return Array.from({ length: 9 }, (_, i) => i).map((i) => {
      const pos = i === 0 ? 1 : i * 4 + 1;
      const item = line[pos];
      return item === " " ? null : item;
    });
  })
  .reverse();

crateLines.forEach((line) => {
  line.forEach((item, crateIndex) => {
    const crate = (crates[crateIndex] = crates[crateIndex] || []);
    if (item) {
      crate.push(item);
    }
  });
});

const moves = movesStr
  .split("\n")
  .filter((l) => l.trim().length > 0)
  .map((line) => {
    const [_, count, fromCrate, toCreate] = line
      .match(/move (\d+) from (\d+) to (\d+)/)!
      .map((s) => parseInt(s, 10));
    return { count, fromCrate: fromCrate - 1, toCreate: toCreate - 1 };
  });

function moveOne(fromCrate: number, toCreate: number) {
  const crate = crates[fromCrate];
  const item = crate.pop()!;
  crates[toCreate].push(item);
}

function moveMany(count: number, fromCrate: number, toCreate: number) {
  for (let i = 0; i < count; i++) {
    moveOne(fromCrate, toCreate);
  }
}

moves.forEach(({ count, fromCrate, toCreate }) => {
  moveMany(count, fromCrate, toCreate);
});

const result = crates.map((crate) => crate[crate.length - 1]).join("");

console.log(result);
