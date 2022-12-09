import { getLines } from "../../utils/getLines.ts";

const input = await Deno.readTextFile("./input.txt");

const lines = getLines(input);

interface Step {
  direction: "L" | "R" | "U" | "D";
  count: number;
}

const steps = lines.map((line): Step => {
  const [dir, count] = line.split(" ");
  return { direction: dir as Step["direction"], count: parseInt(count, 10) };
});

interface Position {
  x: number;
  y: number;
}

const rope: Array<Position> = [
  { x: 0, y: 0 }, // head
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

// const head: Position = { x: 0, y: 0 };
// const tail: Position = { x: 0, y: 0 };

const tailVisited = new Set<string>();

const visit = (pos: Position) => {
  tailVisited.add(`${pos.x},${pos.y}`);
};

const upateKnot = (index: number) => {
  const prev = rope[index - 1];
  const next = rope[index];

  const diffX = next.x - prev.x;
  const diffY = next.y - prev.y;
  const absDiffX = Math.abs(diffX);
  const absDiffY = Math.abs(diffY);
  if (absDiffX <= 1 && absDiffY <= 1) {
    return;
  }
  const updatedAbsDiffX = Math.floor(absDiffX / 2);
  const updatedAbsDiffY = Math.floor(absDiffY / 2);
  next.x = prev.x + (diffX > 0 ? updatedAbsDiffX : -updatedAbsDiffX);
  next.y = prev.y + (diffY > 0 ? updatedAbsDiffY : -updatedAbsDiffY);
};

const head = rope.at(0)!;
const tail = rope.at(-1)!;

visit(tail);

steps.forEach(({ direction, count }) => {
  console.log(`=> Moving ${direction} ${count} times`);
  for (let i = 0; i < count; i++) {
    switch (direction) {
      case "L":
        head.x -= 1;
        break;
      case "R":
        head.x += 1;
        break;
      case "U":
        head.y += 1;
        break;
      case "D":
        head.y -= 1;
        break;
    }
    rope.forEach((_, i) => {
      if (i === 0) {
        return;
      }
      upateKnot(i);
    });
    visit(tail);
    // console.log(`Head(${head.x},${head.y}) Tail(${tail.x},${tail.y})`);
  }
});

console.log({ visited: tailVisited.size });
