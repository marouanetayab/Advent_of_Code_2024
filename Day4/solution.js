const fs = require("fs");

const input = fs.readFileSync('input.txt', 'utf8').trimEnd();

const dirs1 = [[0, 1],[1, 1],[1, 0],[1, -1],[0, -1],[-1, -1],[-1, 0],[-1, 1]];

const flip = {
  M: 'S',
  S: 'M',
};

const dir2 = [
  [1, 1],
  [1, -1],
];

function solve(part) {
  const lines = input.split('\n');
  let count = 0;

  if (part === 1) {
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[0].length; j++) {
        if (lines[i][j] === 'X') {
          outer: for (const [di, dj] of dirs1) {
            let i2 = i + di;
            let j2 = j + dj;
            for (const char of 'MAS') {
              if (lines[i2]?.[j2] !== char) {
                continue outer;
              }
              i2 += di;
              j2 += dj;
            }
            count++;
          }
        }
      }
    }
  } else {
    for (let i = 1; i < lines.length - 1; i++) {
      outer: for (let j = 1; j < lines[0].length - 1; j++) {
        if (lines[i][j] === 'A') {
          for (const [di, dj] of dir2) {
            const char1 = lines[i + di][j + dj];
            if (char1 !== 'M' && char1 !== 'S') {
              continue outer;
            }

            const char2 = lines[i - di][j - dj];
            if (char2 !== flip[char1]) {
              continue outer;
            }
          }
          count++;
        }
      }
    }
  }

  console.log(count);
}

solve(1);
solve(2);
