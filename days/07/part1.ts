import { getLines } from "../../utils/getLines.ts";
import { executeParser, p } from "../../utils/parser/mod.ts";

const input = await Deno.readTextFile('./input.txt');

type Folder = { kind: 'folder'; name: string; children: (Folder | File)[] };

type File = { kind: 'file'; name: string; size: number };

const cdLineParser = p.applyPipe(
  [p.exact('$ cd'), p.regexp(/^[a-z]+/, 'path')],
  (_cd, path) => ({ kind: 'cd', path })
)

const parser = p.

const lines= getLines(input).slice(1);

