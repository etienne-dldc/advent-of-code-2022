import { resolve } from "https://deno.land/std@0.166.0/path/mod.ts";

const files: Array<string> = [];

for await (const dirEntry of Deno.readDir("code")) {
  if (dirEntry.isFile) {
    files.push(dirEntry.name);
  }
}

const latest = "02a.ts" || files.sort().pop()!;

console.log(`Running ${latest}`);

const process = Deno.run({
  cmd: ["deno", "run", "-A", "--unstable", resolve("code", latest)],
});

await process.status();
