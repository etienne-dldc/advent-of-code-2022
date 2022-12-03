export function createCodeFile(): string {
  return [
    `export {};`,
    ``,
    `const input = await Deno.readTextFile('./input.txt');`,
  ].join("\n");
}
