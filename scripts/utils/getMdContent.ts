import {
  DOMParser,
  Element,
  NodeList,
  NodeType,
} from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";

export async function getMdContent(session: string, day: number) {
  const res = await fetch(`https://adventofcode.com/2022/day/${day}`, {
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
  const doc = new DOMParser().parseFromString(text, "text/html");
  if (!doc) {
    throw new Error("Could not parse HTML");
  }
  const main = doc.querySelector("main");
  if (!main) {
    throw new Error("Could not find main element");
  }
  let mdContent = "";
  for (const child of main.children) {
    handleElement(child);
  }
  return mdContent;

  function handleElement(elem: Element) {
    if (elem.tagName === "ARTICLE") {
      for (const child of elem.children) {
        handleElement(child);
      }
      return;
    }
    if (elem.tagName === "P") {
      mdContent += handleInline(elem.childNodes) + "\n\n";
      return;
    }
    if (elem.tagName === "H2") {
      mdContent += `## ${handleInline(elem.childNodes)}\n\n`;
      return;
    }
    if (elem.tagName === "PRE") {
      mdContent += "\n";
      mdContent += `\`\`\`\n${elem.textContent?.trim()}\n\`\`\`\n`;
      mdContent += "\n";
      return;
    }
    if (elem.tagName === "UL") {
      for (const child of elem.children) {
        mdContent += `- ${handleInline(child.childNodes)}\n`;
      }
      mdContent += "\n";
      return;
    }
    if (elem.tagName === "FORM") {
      return;
    }
    console.log(`Unknown element: ${elem.tagName}`);
  }

  function handleInline(items: NodeList): string {
    let result = "";
    items.forEach((item) => {
      if (item.nodeType === NodeType.TEXT_NODE) {
        result += item.textContent;
        return;
      }
      if (item.nodeType === NodeType.ELEMENT_NODE) {
        const elem = item as Element;
        if (elem.tagName === "A") {
          result += `[${handleInline(elem.childNodes)}](${elem.getAttribute(
            "href"
          )})`;
          return;
        }
        if (elem.tagName === "STRONG") {
          result += `**${handleInline(elem.childNodes)}**`;
          return;
        }
        if (elem.tagName === "EM") {
          result += `*${handleInline(elem.childNodes)}*`;
          return;
        }
        if (elem.tagName === "CODE") {
          result += `\`${handleInline(elem.childNodes)}\``;
          return;
        }
        if (elem.tagName === "SPAN") {
          result += handleInline(elem.childNodes);
          return;
        }
        console.log(`Unknown inline element: ${elem.tagName}`);
      }
      console.log(`Unknown node type: ${item.nodeType}`);
    });
    return result;
  }
}
