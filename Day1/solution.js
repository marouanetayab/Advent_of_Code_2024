const fs = require("fs");

const input = fs.readFileSync('./input.txt', 'utf8').trimEnd();

const parseInput = (input) => {
  const lines = input.split('\n');
  return lines.map(line => line.split(/\s+/).map(Number));
};

const data = parseInput(input);

const solve = (part) => {
  if (part === 1) {
    const lefts = data.map(([a]) => a).sort((a, b) => a - b);
    const rights = data.map(([, b]) => b).sort((a, b) => a - b);
    console.log(lefts.reduce((sum, left, i) => sum + Math.abs(left - rights[i]), 0));
  }

  if (part === 2) {
    const lefts = data.map(([a]) => a);
    const rightsCount = data.reduce((counts, [, b]) => {
      counts[b] = (counts[b] ?? 0) + 1;
      return counts;
    }, {});

    console.log(lefts.reduce((sum, left) => sum + left * (rightsCount[left] ?? 0), 0));
  }
};

solve(1); 
solve(2); 
