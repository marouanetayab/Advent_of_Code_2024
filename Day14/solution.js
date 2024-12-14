const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8')
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

class Robot {
  constructor(row) {
    const match = row.match(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/);
    if (match) {
      this.x = parseInt(match[1], 10);
      this.y = parseInt(match[2], 10);
      this.vx = parseInt(match[3], 10);
      this.vy = parseInt(match[4], 10);
    } else {
      throw new Error(`Invalid input format: ${row}`);
    }
  }
}

function solve(part, gridSize = [101, 103]) {
  const robots = input.map(row => new Robot(row));

  if (part === 2) {
    let stepCount = 0;
    while (true) {
      stepCount++;
      const seenPositions = new Set();
      for (const robot of robots) {
        robot.x = (robot.x + robot.vx + gridSize[0]) % gridSize[0];
        robot.y = (robot.y + robot.vy + gridSize[1]) % gridSize[1];
        seenPositions.add(`${robot.x},${robot.y}`);
      }
      if (seenPositions.size === robots.length) {
        console.log(stepCount);
        return;
      }
    }
  }

  for (let t = 0; t < 100; t++) {
    for (const robot of robots) {
      robot.x = (robot.x + robot.vx + gridSize[0]) % gridSize[0];
      robot.y = (robot.y + robot.vy + gridSize[1]) % gridSize[1];
    }
  }

  let result = 1;
  for (const xStart of [0, Math.floor(gridSize[0] / 2) + 1]) {
    for (const yStart of [0, Math.floor(gridSize[1] / 2) + 1]) {
      let robotCount = 0;
      for (const robot of robots) {
        if (robot.x >= xStart && robot.x < xStart + Math.floor(gridSize[0] / 2) &&
          robot.y >= yStart && robot.y < yStart + Math.floor(gridSize[1] / 2)) {
          robotCount++;
        }
      }
      result *= robotCount;
    }
  }
  console.log(result);
}

solve(1);
solve(2);
