export async function getInput(session: string, day: number) {
  const res = await fetch(`https://adventofcode.com/2022/day/${day}/input`, {
    method: "GET",
    headers: {
      accept: "text/html",
      cookie: `session=${session}`,
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const text = await res.text();
  return text;
}
