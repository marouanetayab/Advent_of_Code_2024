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

function bfs(map, start, end, capturePath = false) {
    const queue = [[...start, 0]];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[start[0]][start[1]] = true;

    const path = capturePath ? [] : null;

    while (queue.length > 0) {
        const [r, c, steps] = queue.shift();

        if (capturePath) path.push({ x: c, y: r, steps });

        if (r === end[0] && c === end[1]) {
            return capturePath ? { steps, path } : steps;
        }

        for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && map[nr][nc] !== '#') {
                visited[nr][nc] = true;
                queue.push([nr, nc, steps + 1]);
            }
        }
    }

    return capturePath ? { steps: Infinity, path: [] } : Infinity;
}

function calculateCheats(map, start, end, originalTime) {
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

    return cheats;
}

function calculateSkips(path) {
    let skips = 0;

    for (let i = 0; i < path.length - 1; i++) {
        for (let j = i + 1; j < path.length; j++) {
            const { x: x1, y: y1, steps: t1 } = path[i];
            const { x: x2, y: y2, steps: t2 } = path[j];

            const manhattanDistance = Math.abs(x1 - x2) + Math.abs(y1 - y2);

            if (manhattanDistance <= 20) {
                const savedTime = t2 - t1 - manhattanDistance;

                if (savedTime >= 100) {
                    skips++;
                }
            }
        }
    }

    return skips;
}

function solve(part) {
    const { start, end } = findPositions(map);

    if (part === 1) {
        const originalTime = bfs(map, start, end);
        const cheats = calculateCheats(map, start, end, originalTime);

        const cheatCounts = cheats.reduce((counts, timeSaved) => {
            counts[timeSaved] = (counts[timeSaved] || 0) + 1;
            return counts;
        }, {});

        const sumCheatsSavingAtLeast100 = Object.keys(cheatCounts)
            .filter(timeSaved => parseInt(timeSaved, 10) >= 100)
            .reduce((sum, timeSaved) => sum + cheatCounts[timeSaved], 0);

        console.log(sumCheatsSavingAtLeast100);
    } else if (part === 2) {
        const { path } = bfs(map, start, end, true);
        const skips = calculateSkips(path);

        console.log(skips);
    } else {
        console.error("Invalid part. Please specify 1 or 2.");
    }
}

solve(1);
solve(2);
