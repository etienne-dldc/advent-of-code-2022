import { getLines } from "../../utils/getLines.ts";
import { chunk } from "https://deno.land/std@0.114.0/collections/chunk.ts";

const input = await Deno.readTextFile("./input.txt");

const lines = getLines(input);

const PRIORITY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
  ""
);

let sum = 0;

const groups = chunk(lines, 3);

groups.forEach((group) => {
  const key = findCommon(...group.map((line) => line.split("")));
  sum += getPriority(key);
});

console.log({ sum });

function getPriority(char: string) {
  return PRIORITY.indexOf(char) + 1;
}

function findCommon(...lists: Array<string[]>): string {
  const all = new Set(lists.flat());
  for (const item of all) {
    if (lists.every((list) => list.includes(item))) {
      return item;
    }
  }
  throw new Error("No common item found");
}
