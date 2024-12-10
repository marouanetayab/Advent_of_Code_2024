const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trimEnd();

function solve(input, part) {
  let totalSum = 0;

  for (const line of input.split('\n')) {
    const [target, ...numbers] = line.match(/\d+/g).map(Number);

    let possibleResults = [numbers[0]];

    for (let i = 1; i < numbers.length; i++) {
      const currentNumber = numbers[i];
      const newResults = [];

      for (const result of possibleResults) {
        newResults.push(result + currentNumber);
        newResults.push(result * currentNumber);

        if (part === 2) {
          newResults.push(parseInt('' + result + currentNumber, 10));
        }
      }

      possibleResults = newResults.filter((result) => result <= target);
    }

    if (possibleResults.some((result) => result === target)) {
      totalSum += target;
    }
  }

  console.log(totalSum);
}

solve(input, 1); 
solve(input, 2);
