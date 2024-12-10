const fs = require("fs");

var input = fs.readFileSync('./input.txt', 'utf8').trimEnd();

function solve(part) {
  if (part === 2) {
    const replacement = /don't\(\)[^]+?($|do\(\))/g
    input = input.replace(replacement, '');
  }
  const matches = input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);
  const nums = Array.from(matches).map((match) => [+match[1], +match[2]]);
  const sum = nums.reduce((acc, [a, b]) => acc + a * b, 0);
  console.log(sum);
}
solve(1);
solve(2);