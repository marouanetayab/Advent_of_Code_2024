const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trim();
const map = input.split('\n').map(row => row.split('').map(Number));

const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
];

const isInBounds = (x, y) => x >= 0 && x < map.length && y >= 0 && y < map[0].length;

const exploreTrails = (startX, startY, part) => {
    const seen = new Set();
    const queue = [[startX, startY, `${startX},${startY}`, 0]];
    const results = part === 1 ? new Set() : new Set();

    while (queue.length) {
        const [x, y, path, height] = queue.pop();
        const key = `${x},${y}`;

        if (seen.has(key) && part === 1) continue;
        seen.add(key);

        if (map[x][y] === 9) {
            if (part === 1) results.add(key); 
            else results.add(path);
            continue;
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;

            if (
                isInBounds(nx, ny) &&
                map[nx][ny] === height + 1 &&
                (part === 1 || !path.includes(`${nx},${ny}`))
            ) {
                queue.push([nx, ny, `${path}-${nx},${ny}`, map[nx][ny]]);
            }
        }
    }

    return results.size;
};

const solve = (part) => {
    return map.flatMap((row, x) =>
        row.map((cell, y) => (cell === 0 ? exploreTrails(x, y, part) : 0))
    ).reduce((a, b) => a + b, 0);
};

console.log(solve(1));
console.log(solve(2));