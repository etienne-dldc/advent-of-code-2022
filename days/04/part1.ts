import { getLines } from "../../utils/getLines.ts";

const input = await Deno.readTextFile("./input.txt");

const lines = getLines(input);

let count = 0;

lines.forEach((line) => {
  const [left, right] = line.split(",");
  const [lMin, lMax] = left.split("-").map(Number);
  const [rMin, rMax] = right.split("-").map(Number);
  if ((lMin <= rMin && rMax <= lMax) || (rMin <= lMin && lMax <= rMax)) {
    count++;
  }
});

console.log({ count });
