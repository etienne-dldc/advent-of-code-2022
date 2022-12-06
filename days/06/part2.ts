export {};

const input = await Deno.readTextFile("./input.txt");

const chars = input.trim().split("");

const queue: string[] = [];

for (let i = 0; i < chars.length; i++) {
  const char = chars[i];
  queue.push(char);
  if (queue.length > 14) {
    queue.shift();
  }
  if (new Set(queue).size === 14) {
    console.log(i + 1);
    break;
  }
}
