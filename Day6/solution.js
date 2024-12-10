const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trimEnd();
const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];

function executeMovement(map, startPosition) {
  let directionIndex = 0;
  let [dy, dx] = dirs[0];
  let [y, x] = startPosition;
  const visited = map.map(row => row.map(() => []));

  while (map[y]?.[x] !== undefined) {
    if (visited[y][x].includes(directionIndex)) return { visited, loops: 1 };
    visited[y][x].push(directionIndex);

    let [nextY, nextX] = [y + dy, x + dx];
    while (map[nextY]?.[nextX] === 1) {
      directionIndex = (directionIndex + 1) % 4;
      [dy, dx] = dirs[directionIndex];
      [nextY, nextX] = [y + dy, x + dx];
    }
    [y, x] = [nextY, nextX];
  }
  return { visited, loops: 0 };
}

function solve(input, part) {
  let startPosition;
  const map = input.split('\n').map((row, i) =>
    row.split('').map((char, j) => {
      if (char === '^') startPosition = [i, j];
      return char === '#' ? 1 : 0;
    })
  );

  const { visited } = executeMovement(map, startPosition);

  if (part === 1) {
    console.log(visited.flat().filter(arr => arr.length).length);
  } else if (part === 2) {
    let loopCount = 0;
    map.forEach((row, i) => row.forEach((_, j) => {
      if (visited[i][j].length) {
        map[i][j] = 1;
        loopCount += executeMovement(map, startPosition).loops;
        map[i][j] = 0;
      }
    }));
    console.log(loopCount);
  }
}

solve(input, 1);
solve(input, 2);
