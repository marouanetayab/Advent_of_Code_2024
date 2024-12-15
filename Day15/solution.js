const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8").trimEnd();

const dirs = {
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
  "^": [-1, 0],
};

function generateGrid(grid, part) {
  let startingPosition = null;

  if (part === 1) {
    grid = grid.split("\n").map((row, rowIndex) =>
      row.split("").map((cell, colIndex) => {
        if (cell === "@") {
          startingPosition = [rowIndex, colIndex];
          return ".";
        }
        return cell;
      })
    );
  } else {
    grid = grid.split("\n").map((row, rowIndex) =>
      row.split("").flatMap((cell, colIndex) => {
        switch (cell) {
          case "@":
            startingPosition = [rowIndex, colIndex * 2];
            return "..".split("");
          case "O":
            return "[]".split("");
          default:
            return [cell, cell];
        }
      })
    );
  }

  return { grid, startingPosition };
}

function solve1() {
  let [grid, movementSequence] = input.split("\n\n");
  const result = generateGrid(grid, 1);
  grid = result.grid;
  let currentPosition = result.startingPosition;

  movementSequence = movementSequence.replaceAll("\n", "").split("");

  for (const move of movementSequence) {
    const [deltaRow, deltaCol] = dirs[move];
    const [currentRow, currentCol] = currentPosition;
    let [nextRow, nextCol] = [currentRow + deltaRow, currentCol + deltaCol];

    switch (grid[nextRow][nextCol]) {
      case ".": {
        currentPosition = [nextRow, nextCol];
        break;
      }
      case "O": {
        const queue = [];
        let [obstacleRow, obstacleCol] = [nextRow, nextCol];
        while (grid[obstacleRow][obstacleCol] === "O") {
          queue.push([obstacleRow, obstacleCol]);
          obstacleRow += deltaRow;
          obstacleCol += deltaCol;
        }
        if (grid[obstacleRow][obstacleCol] === ".") {
          currentPosition = [nextRow, nextCol];
          queue.sort(([rowA, colA], [rowB, colB]) =>
            deltaRow ? deltaRow * (rowB - rowA) : deltaCol * (colB - colA)
          );
          for ([obstacleRow, obstacleCol] of queue) {
            grid[obstacleRow + deltaRow][obstacleCol + deltaCol] = "O";
            grid[obstacleRow][obstacleCol] = ".";
          }
        }
      }
    }
  }

  let totalScore = 0;
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
      if (grid[rowIndex][colIndex] === "O") {
        totalScore += 100 * rowIndex + colIndex;
      }
    }
  }
  console.log(totalScore);
}

function solve2() {
  let [grid, movementSequence] = input.split("\n\n");
  const result = generateGrid(grid, 2);
  grid = result.grid;

  let currentPosition = result.startingPosition;
  movementSequence = movementSequence.replaceAll("\n", "").split("");

  for (const move of movementSequence) {
    const [deltaRow, deltaCol] = dirs[move];
    const [currentRow, currentCol] = currentPosition;
    let [nextRow, nextCol] = [currentRow + deltaRow, currentCol + deltaCol];

    outer: switch (grid[nextRow][nextCol]) {
      case ".": {
        currentPosition = [nextRow, nextCol];
        break;
      }
      case "[":
      case "]": {
        if (deltaRow === 0) {
          let [obstacleRow, obstacleCol] = [nextRow, nextCol];
          while ("[]".includes(grid[obstacleRow][obstacleCol])) {
            obstacleCol += deltaCol;
          }
          if (grid[obstacleRow][obstacleCol] === ".") {
            currentPosition = [nextRow, nextCol];
            let previousCell = grid[nextRow][nextCol];
            grid[nextRow][nextCol] = ".";
            while (nextRow !== obstacleRow || nextCol !== obstacleCol) {
              nextRow += deltaRow;
              nextCol += deltaCol;
              [previousCell, grid[nextRow][nextCol]] = [
                grid[nextRow][nextCol],
                previousCell,
              ];
            }
          }
        } else {
          const initialPositions = [
            [nextRow, nextCol],
            grid[nextRow][nextCol] === "["
              ? [nextRow, currentCol + 1]
              : [nextRow, currentCol - 1],
          ];
          let frontier = [...initialPositions];
          while (frontier.some(([row, col]) => "[]".includes(grid[row][col]))) {
            const nextFrontier = [];
            for (let [frontRow, frontCol] of frontier) {
              if (grid[frontRow][frontCol] === ".") continue;

              frontRow += deltaRow;
              switch (grid[frontRow][frontCol]) {
                case "#":
                  break outer;
                case ".":
                  nextFrontier.push([frontRow, frontCol]);
                  break;
                case "[":
                  nextFrontier.push(
                    [frontRow, frontCol],
                    [frontRow, frontCol + 1]
                  );
                  break;
                case "]":
                  nextFrontier.push(
                    [frontRow, frontCol],
                    [frontRow, frontCol - 1]
                  );
                  break;
              }
            }
            frontier = nextFrontier;
          }

          currentPosition = [nextRow, nextCol];
          let updatedFrontier = initialPositions.map(([row, col]) => [
            row,
            col,
            grid[row][col],
          ]);
          for (const [row, col] of updatedFrontier) {
            grid[row][col] = ".";
          }
          while (updatedFrontier.length !== 0) {
            const nextUpdatedFrontier = [];
            for (let [row, col, char] of updatedFrontier) {
              row += deltaRow;
              switch (grid[row][col]) {
                case ".":
                  grid[row][col] = char;
                  break;
                case "[":
                  nextUpdatedFrontier.push(
                    [row, col, "["],
                    [row, col + 1, "]"]
                  );
                  grid[row][col] = char;
                  grid[row][col + 1] = ".";
                  break;
                case "]":
                  nextUpdatedFrontier.push(
                    [row, col, "]"],
                    [row, col - 1, "["]
                  );
                  grid[row][col] = char;
                  grid[row][col - 1] = ".";
                  break;
              }
            }
            updatedFrontier = nextUpdatedFrontier;
          }
        }
      }
    }
  }

  let totalScore = 0;
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
      if (grid[rowIndex][colIndex] === "[") {
        totalScore += 100 * rowIndex + colIndex;
      }
    }
  }
  console.log(totalScore);
}

solve1();
solve2();
