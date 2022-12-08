import { getLines } from "../../utils/getLines.ts";

const input = await Deno.readTextFile("./input.txt");

const lines = getLines(input);

const trees = lines.map((line) => {
  const nums = line.split("").map((v) => parseInt(v, 10));
  return nums;
});

let maxScore = 0;
let maxScorePos = { x: 0, y: 0 };

trees.forEach((line, y) => {
  line.forEach((_, x) => {
    const top = getViewingDist({ x, y }, (pos) => ({ x: pos.x, y: pos.y - 1 }));
    const bottom = getViewingDist({ x, y }, (pos) => ({
      x: pos.x,
      y: pos.y + 1,
    }));
    const left = getViewingDist({ x, y }, (pos) => ({
      x: pos.x - 1,
      y: pos.y,
    }));
    const right = getViewingDist({ x, y }, (pos) => ({
      x: pos.x + 1,
      y: pos.y,
    }));
    const score = top * bottom * left * right;
    if (score > maxScore) {
      maxScore = score;
      maxScorePos = { x, y };
    }
  });
});

console.log({ maxScore, maxScorePos });

interface Pos {
  x: number;
  y: number;
}

function getViewingDist(pos: Pos, next: (pos: Pos) => Pos): number {
  const height = getHeight(pos);
  let dist = 0;
  let current = next(pos);
  while (true) {
    const nextHeight = getHeight(current);
    if (nextHeight === -1) {
      break;
    }
    dist++;
    if (nextHeight >= height) {
      break;
    }
    current = next(current);
  }
  return dist;
}

function getHeight(pos: Pos) {
  if (
    pos.x < 0 ||
    pos.y < 0 ||
    pos.x >= trees[0].length ||
    pos.y >= trees.length
  ) {
    return -1;
  }
  return trees[pos.y][pos.x];
}
