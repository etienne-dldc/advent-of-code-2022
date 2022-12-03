import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

import { ensureDir } from "https://deno.land/std@0.144.0/fs/ensure_dir.ts";
import { getDays } from "./utils/getDays.ts";
import { maybeStat } from "./utils/maybeStat.ts";
import { getMdContent } from "./utils/getMdContent.ts";
import { getInput } from "./utils/getInput.ts";
import { createCodeFile } from "./utils/createCodeFile.ts";
import { maybeRead } from "./utils/maybeRead.ts";

await main();

async function main() {
  const days = getDays();
  const envs = config() as { ADVENT_OF_CODE_SESSION: string };

  for (const day of days) {
    console.log(`Settting up day ${day}`);

    const dayStr = day.toString().padStart(2, "0");
    const folder = `days/${dayStr}`;
    await ensureDir(folder);
    const descFile = `${folder}/desc.md`;
    const descExists = await maybeStat(descFile);
    if (descExists) {
      continue;
    }
    const mdContent = await getMdContent(envs.ADVENT_OF_CODE_SESSION, day);
    await Deno.writeFile(descFile, new TextEncoder().encode(mdContent));
    const inputFile = `${folder}/input.txt`;
    const inputExists = await maybeStat(inputFile);
    if (!inputExists) {
      const input = await getInput(envs.ADVENT_OF_CODE_SESSION, day);
      await Deno.writeFile(inputFile, new TextEncoder().encode(input));
    }
    const part1File = `${folder}/part1.ts`;
    const part2File = `${folder}/part2.ts`;
    const part1Exists = await maybeRead(part1File);
    if (!part1Exists) {
      const code = createCodeFile();
      await Deno.writeFile(part1File, new TextEncoder().encode(code));
    } else {
      await Deno.writeFile(part2File, new TextEncoder().encode(part1Exists));
    }
  }
}
