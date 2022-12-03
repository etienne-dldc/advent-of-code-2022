import { resolve } from "https://deno.land/std@0.144.0/path/mod.ts";
import { getDays } from "./utils/getDays.ts";
import { maybeStat } from "./utils/maybeStat.ts";

await main();

async function main() {
  const days = getDays();
  const dayPrompt = prompt(
    "Which day do you want to run?",
    days[days.length - 1].toString()
  );
  if (!dayPrompt) {
    console.log("No day provided");
    return;
  }
  const day = parseInt(dayPrompt, 10);
  if (isNaN(day)) {
    console.log("Invalid day provided");
    return;
  }
  const dayStr = day.toFixed().padStart(2, "0");
  const dayFolder = `days/${dayStr}`;
  const folderExists = await maybeStat(dayFolder);
  if (!folderExists) {
    console.log("Day does not exist, run setup !");
    return;
  }
  const part1File = `${dayFolder}/part1.ts`;
  const part2File = `${dayFolder}/part2.ts`;
  const part1Exists = await maybeStat(part1File);
  if (!part1Exists) {
    console.log("Part 1 does not exist, run setup !");
    return;
  }
  const part2Exists = await maybeStat(part2File);
  if (!part2Exists) {
    await runFile(dayFolder, part1File);
    return;
  }
  const partPrompt = prompt("Which part do you want to run?", "2");
  if (!partPrompt) {
    console.log("No part provided");
    return;
  }
  const part = parseInt(partPrompt, 10);
  if (isNaN(part)) {
    console.log("Invalid part provided");
    return;
  }
  const runningFile = part === 1 ? part1File : part2File;
  await runFile(dayFolder, runningFile);
}

async function runFile(cwd: string, file: string) {
  console.log(`Running file ${file}`);
  const process = Deno.run({
    cwd,
    cmd: ["deno", "run", "-A", "--unstable", resolve(file)],
  });
  await process.status();
}
