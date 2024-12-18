const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8").trim();
const coordinates = input
  .split("\n")
  .map((line) => line.split(",").map(Number));
const gridSize = 71;
const initialBytes = 1024;

const directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function binarySearch(start, end, condition) {
  while (start < end) {
    const middle = Math.floor((start + end) / 2);
    if (condition(middle)) {
      end = middle;
    } else {
      start = middle + 1;
    }
  }
  return start;
}

function solve(part) {
  function calculateMinSteps(byteCount) {
    const memoryGrid = Array.from({ length: gridSize }).map(() =>
      Array.from({ length: gridSize }).fill(1)
    );
    for (let i = 0; i < byteCount; i++) {
      const [x, y] = coordinates[i];
      memoryGrid[y][x] = 0;
    }

    const stepsGrid = memoryGrid.map((row) =>
      row.map(() => Number.MAX_SAFE_INTEGER)
    );
    let queue = [[0, 0, 0]];
    while (queue.length !== 0) {
      const nextQueue = [];
      for (const [x, y, steps] of queue) {
        if (!memoryGrid[y]?.[x] || steps >= stepsGrid[y][x]) {
          continue;
        }
        stepsGrid[y][x] = steps;

        nextQueue.push(
          ...directions.map(([dx, dy]) => [x + dx, y + dy, steps + 1])
        );
      }
      queue = nextQueue;
    }
    return stepsGrid[gridSize - 1][gridSize - 1];
  }

  if (part === 1) {
    console.log(calculateMinSteps(initialBytes));
  } else if (part === 2) {
    const firstUnreachable = binarySearch(
      initialBytes + 1,
      coordinates.length - 1,
      (byteCount) => calculateMinSteps(byteCount) === Number.MAX_SAFE_INTEGER
    );
    console.log(coordinates[firstUnreachable - 1].join());
  }
}

solve(1);
solve(2);
