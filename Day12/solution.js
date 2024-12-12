const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split("\n");

const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1] 
];

function isOutOfBounds(y, x, currentChar) {
    return y < 0 || y >= input.length || x < 0 || x >= input[0].length || input[y][x] !== currentChar;
}

function solve(part) {
    let result = 0;
    let visitedCells = {};

    for (let row = 0; row < input.length; row++) {
        for (let col = 0; col < input[0].length; col++) {
            if (visitedCells[[row, col]]) continue;

            let currentChar = input[row][col];
            let areaSize = 0;
            let walls = {};
            let perimeterCount = 0;

            const exploreCell = (y, x, prevY, prevX) => {
                if (isOutOfBounds(y, x, currentChar)) {
                    if (x === prevX) {
                        if (!walls[["y", y, prevY]]) walls[["y", y, prevY]] = [];
                        walls[["y", y, prevY]].push(x);
                    } else {
                        if (!walls[["x", x, prevX]]) walls[["x", x, prevX]] = [];
                        walls[["x", x, prevX]].push(y);
                    }
                    perimeterCount++;
                    return;
                }

                if (visitedCells[[y, x]]) return;

                areaSize++;
                visitedCells[[y, x]] = true;

                for (const [dy, dx] of dirs) {
                    exploreCell(y + dy, x + dx, y, x);
                }
            };

            exploreCell(row, col);
            
            let wallCount = 0;
            for (let wallKey in walls) {
                let wallPositions = walls[wallKey];
                wallPositions.sort((a, b) => a - b);
                let previousPos = Number.NEGATIVE_INFINITY;
                for (let position of wallPositions) {
                    if (position > previousPos + 1) wallCount++;
                    previousPos = position;
                }
            }

            if (part === 1) {
                result += areaSize * perimeterCount;
            } else {
                result += areaSize * wallCount;
            }
        }
    }

    console.log(result);
}

solve(1);
solve(2);
