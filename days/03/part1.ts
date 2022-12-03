import { getLines } from "../../utils/getLines.ts";

const input = await Deno.readTextFile("./input.txt");

const lines = getLines(input);

const PRIORITY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
  ""
);

let sum = 0;

lines.forEach((line) => {
  const items = line.split("");
  const size = items.length;
  const left = items.slice(0, size / 2);
  const right = items.slice(size / 2);
  const both: string[] = [];
  left.forEach((char) => {
    if (right.includes(char) && !both.includes(char)) {
      both.push(char);
    }
  });
  const first = both[0];
  sum += getPriority(first);
});

console.log({ sum });

function getPriority(char: string) {
  return PRIORITY.indexOf(char) + 1;
}
