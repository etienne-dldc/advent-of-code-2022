import { getLines } from "../../utils/getLines.ts";

const input = await Deno.readTextFile("./input.txt");

const lines = getLines(input);

let count = 0;

lines.forEach((line) => {
  const [left, right] = line.split(",");
  const [lMin, lMax] = left.split("-").map(Number);
  const [rMin, rMax] = right.split("-").map(Number);
  if (
    // if rMin is between lMin and lMax
    (lMin <= rMin && rMin <= lMax) ||
    // if rMax is between lMin and lMax
    (lMin <= rMax && rMax <= lMax) ||
    // if lMin is between rMin and rMax
    (rMin <= lMin && lMin <= rMax) ||
    // if lMax is between rMin and rMax
    (rMin <= lMax && lMax <= rMax)
  ) {
    count++;
  }
});

console.log({ count });
