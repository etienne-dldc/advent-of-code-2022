import { getLines } from "../../utils/getLines.ts";
import { executeParser, p } from "../../utils/parser/mod.ts";
import { StringReader } from "../../utils/parser/StringReader.ts";

const input = await Deno.readTextFile("./input.txt");

type Folder = { kind: "folder"; name: string; children: (Folder | File)[] };

type File = { kind: "file"; name: string; size: number };

type Command =
  | { kind: "cd"; name: string }
  | { kind: "ls" }
  | { kind: "dir"; name: string }
  | { kind: "file"; size: number; name: string };

const numberParser = p.apply(p.regexp(/^\d+/g, "number"), (number) =>
  parseInt(number, 10)
);

const nameParser = p.regexp(/^[a-zA-Z.]+/g, "name");

const cdLineParser = p.applyPipe(
  [p.exact("$ cd "), nameParser],
  ([_cd, name]): Command => ({ kind: "cd", name })
);

const lsLineParser = p.apply(p.exact("$ ls"), (): Command => ({ kind: "ls" }));

const dirLineParser = p.applyPipe(
  [p.exact("dir "), nameParser],
  ([_dir, name]): Command => ({ kind: "dir", name })
);

const fileLineParser = p.applyPipe(
  [numberParser, p.exact(" "), nameParser],
  ([size, _space, name]): Command => ({ kind: "file", size, name })
);

const parser = p.applyPipe(
  [p.oneOf(cdLineParser, lsLineParser, dirLineParser, fileLineParser), p.eof()],
  ([command]): Command => command
);

const commands = getLines(input)
  .slice(1) // skip first line
  .map((lineStr) => {
    const result = executeParser(parser, StringReader(lineStr), {});
    if (result.type === "Failure") {
      console.log(result.message);
      throw new Error(`Failed to parse line: ${lineStr}`);
    }
    return result.value;
  });

const root: Folder = { kind: "folder", name: ".", children: [] };

const stack: Folder[] = [root];

console.log(commands);

const queue: Command[] = [...commands];

while (queue.length > 0) {
  const command = queue.shift();
  if (!command) {
    break;
  }
  if (command.kind === "cd") {
    if (command.name === "..") {
      stack.pop();
      continue;
    }
    const currentFolder = stack[stack.length - 1];
    const folder = currentFolder.children.find(
      (child) => child.name === command.name
    );
    if (!folder || folder.kind !== "folder") {
      throw new Error(`Folder not found: ${command.name}`);
    }
    stack.push(folder);
    continue;
  }
  if (command.kind === "ls") {
    const currentFolder = stack[stack.length - 1];
    while (queue.length > 0) {
      const nextCommand = queue[0];
      if (nextCommand.kind === "dir") {
        currentFolder.children.push({
          kind: "folder",
          name: nextCommand.name,
          children: [],
        });
        queue.shift();
        continue;
      }
      if (nextCommand.kind === "file") {
        currentFolder.children.push({
          kind: "file",
          name: nextCommand.name,
          size: nextCommand.size,
        });
        queue.shift();
        continue;
      }
      break;
    }
    continue;
  }
  throw new Error(`Unknown command: ${command}`);
}

const foldersSize = new Map<string, number>();

traverse<number>(root, (item, path, next) => {
  if (item.kind === "file") {
    return item.size;
  }

  const size = next().reduce((acc, size) => acc + size, 0);
  foldersSize.set(path.join("/"), size);
  return size;
});

const totalSize = foldersSize.get(".") ?? 0;
const freeSpace = 70000000 - totalSize;
const missingSpace = 30000000 - freeSpace;

const folderToDeleteSize = [...foldersSize.values()]
  .filter((v) => v >= missingSpace)
  .sort((a, b) => a - b)[0];

console.log({ missingSpace, folderToDeleteSize });

function traverse<Result>(
  tree: Folder | File,
  onItem: (
    item: Folder | File,
    path: Array<string>,
    next: () => Array<Result>
  ) => Result,
  basePath: Array<string> = []
): Result {
  const localPath = [...basePath, tree.name];
  if (tree.kind === "folder") {
    return onItem(tree, localPath, () =>
      tree.children.map((child) => traverse(child, onItem, localPath))
    );
  }
  return onItem(tree, localPath, () => []);
}
