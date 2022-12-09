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

const head: Position = { x: 0, y: 0 };
const tail: Position = { x: 0, y: 0 };

const tailVisited = new Set<string>();

const visit = (pos: Position) => {
  tailVisited.add(`${pos.x},${pos.y}`);
};

visit(tail);

const upateTail = () => {
  const diffX = tail.x - head.x;
  const diffY = tail.y - head.y;
  const absDiffX = Math.abs(diffX);
  const absDiffY = Math.abs(diffY);
  if (absDiffX <= 1 && absDiffY <= 1) {
    return;
  }
  if (absDiffX === absDiffY) {
    throw new Error("Unexpected");
  }
  const updatedAbsDiffX = Math.floor(absDiffX / 2);
  const updatedAbsDiffY = Math.floor(absDiffY / 2);
  tail.x = head.x + (diffX > 0 ? updatedAbsDiffX : -updatedAbsDiffX);
  tail.y = head.y + (diffY > 0 ? updatedAbsDiffY : -updatedAbsDiffY);
};

steps.forEach(({ direction, count }) => {
  // console.log(`=> Moving ${direction} ${count} times`);
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
    upateTail();
    visit(tail);
    // console.log(`Head(${head.x},${head.y}) Tail(${tail.x},${tail.y})`);
  }
});

console.log({ visited: tailVisited.size });
