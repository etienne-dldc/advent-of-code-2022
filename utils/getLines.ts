export function getLines(content: string): Array<string> {
  const lines = content.split("\n");
  // remove last line if empty
  if (lines[lines.length - 1].trim().length === 0) {
    lines.pop();
  }
  return lines;
}
