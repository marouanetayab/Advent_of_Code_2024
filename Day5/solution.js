const fs = require("fs");

const input = fs.readFileSync('input.txt', 'utf8').trimEnd();

function solve(input, part) {
  const [ruleText, updateText] = input.split('\n\n');
  
  const ruleMap = {};
  for (const rule of ruleText.split('\n')) {
    const [left, right] = rule.split('|').map(Number);
    (ruleMap[left] ??= {})[right] = -1;
  }

  let totalSum = 0;
  for (const update of updateText.split('\n')) {
    const pageNumbers = update.split(',').map(Number);
    const sortedPages = pageNumbers.slice().sort((a, b) => ruleMap[a]?.[b] ?? 0);

    if (pageNumbers.every((page, i) => page === sortedPages[i])) {
      if (part === 1) {
        totalSum += pageNumbers[(pageNumbers.length - 1) / 2];
      }
    } else if (part === 2) {
      totalSum += sortedPages[(sortedPages.length - 1) / 2];
    }
  }
  console.log(totalSum);
}

solve(input, 1);
solve(input, 2);
