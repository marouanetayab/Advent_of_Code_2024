const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n');
const map = input.map(line => line.split(''));
const rows = map.length;
const cols = map[0].length;

const dirs = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
];

function findPositions(map) {
    let start, end;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (map[r][c] === 'S') start = [r, c];
            if (map[r][c] === 'E') end = [r, c];
        }
    }
    return { start, end };
}

function bfs(map, start, end) {
    const queue = [[...start, 0]];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[start[0]][start[1]] = true;

    while (queue.length > 0) {
        const [r, c, steps] = queue.shift();

        if (r === end[0] && c === end[1]) return steps;

        for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && map[nr][nc] !== '#') {
                visited[nr][nc] = true;
                queue.push([nr, nc, steps + 1]);
            }
        }
    }

    return Infinity;
}

function solve(part) {
    const { start, end } = findPositions(map);
    const originalTime = bfs(map, start, end);

    if (part === 1) {
        const cheats = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (map[r][c] === '#') {
                    map[r][c] = '.';
                    const timeWithCheat = bfs(map, start, end);
                    if (timeWithCheat < originalTime) {
                        cheats.push(originalTime - timeWithCheat);
                    }
                    map[r][c] = '#';
                }
            }
        }

        const cheatCounts = cheats.reduce((counts, timeSaved) => {
            counts[timeSaved] = (counts[timeSaved] || 0) + 1;
            return counts;
        }, {});

        const sumCheatsSavingAtLeast100 = Object.keys(cheatCounts)
            .filter(timeSaved => parseInt(timeSaved, 10) >= 100)
            .reduce((sum, timeSaved) => sum + cheatCounts[timeSaved], 0);

        console.log(sumCheatsSavingAtLeast100);
    } else {
        const pathPositions = [];
        const visited = new Set();
        const queue = [{ x: start[1], y: start[0], steps: 0 }];

        while (queue.length > 0) {
            const { x, y, steps } = queue.shift();
            pathPositions.push({ x, y, steps });

            if (x === end[1] && y === end[0]) break;
            visited.add(`${x},${y}`);
            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                if (
                    nx >= 0 &&
                    ny >= 0 &&
                    nx < cols &&
                    ny < rows &&
                    !visited.has(`${nx},${ny}`) &&
                    map[ny][nx] !== '#'
                ) {
                    queue.push({ x: nx, y: ny, steps: steps + 1 });
                }
            }
        }

        let skips = 0;

        for (let i = 0; i < pathPositions.length - 1; i++) {
            for (let j = i + 1; j < pathPositions.length; j++) {
                const savedBySkipping = j - i;
                const xDiff = Math.abs(pathPositions[i].x - pathPositions[j].x);
                const yDiff = Math.abs(pathPositions[i].y - pathPositions[j].y);

                if (xDiff + yDiff <= 20) {
                    const saved = savedBySkipping - (xDiff + yDiff);

                    if (saved >= 100) {
                        skips++;
                    }
                }
            }
        }

        console.log(skips);
    } 
}

solve(1);
solve(2);
