import { getLines } from "../../utils/getLines.ts";

const input = await Deno.readTextFile("./input.txt");

const lines = getLines(input);

interface Tree {
  height: number;
  visible: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}

const trees_left = lines.map((line) => {
  const nums = line.split("").map((v) => parseInt(v, 10));
  return nums.map((num): Tree => {
    return {
      height: num,
      visible: { left: false, right: false, top: false, bottom: false },
    };
  });
});

const trees_right = trees_left.map((line) => {
  return [...line].reverse();
});

const trees_top = Array.from({ length: lines[0].length }, (_, i) => {
  return trees_left.map((line) => line[i]);
});

const trees_bottom = trees_top.map((line) => {
  return [...line].reverse();
});

const trees_all = trees_left.flat();

checkVisible(trees_left, (t) => (t.visible.left = true));
checkVisible(trees_right, (t) => (t.visible.right = true));
checkVisible(trees_top, (t) => (t.visible.top = true));
checkVisible(trees_bottom, (t) => (t.visible.bottom = true));

const visibleTrees = trees_all.filter((t) => {
  const v = t.visible;
  return v.left || v.right || v.top || v.bottom;
});

console.log({ visibleTrees: visibleTrees.length });

function checkVisible(trees: Tree[][], onVisible: (tree: Tree) => void) {
  for (const line of trees) {
    let maxHeight = -1;
    for (const tree of line) {
      if (maxHeight === 9) {
        break;
      }
      if (tree.height > maxHeight) {
        maxHeight = tree.height;
        onVisible(tree);
      }
    }
  }
}
