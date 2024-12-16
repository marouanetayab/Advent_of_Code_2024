const fs = require('fs');

// Read and parse the grid from the input file
const grid = fs.readFileSync('input.txt', 'utf-8').split('\n').map(line => line.split(''));

function parseGrid() {
    const numRows = grid.length, numCols = grid[0].length;
    let startPosition = null, endPosition = null;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (grid[row][col] === 'S') startPosition = [row, col];
            if (grid[row][col] === 'E') endPosition = [row, col];
        }
    }

    return { startPosition, endPosition, numRows, numCols };
}

function dijkstra(startPosition, numRows, numCols) {
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const priorityQueue = [], visitedNodes = new Map();

    priorityQueue.push([0, { row: startPosition[0], col: startPosition[1], direction: 1 }]);
    visitedNodes.set(`${startPosition[0]},${startPosition[1]},1`, 0);

    while (priorityQueue.length) {
        const [currentCost, { row, col, direction }] = priorityQueue.shift();

        if ((visitedNodes.get(`${row},${col},${direction}`) || Infinity) < currentCost) continue;

        const [dx, dy] = directions[direction];
        const newRow = row + dx, newCol = col + dy;

        if (newRow >= 0 && newCol >= 0 && newRow < numRows && newCol < numCols && grid[newRow][newCol] !== '#') {
            const newCost = currentCost + 1;
            const key = `${newRow},${newCol},${direction}`;
            if (newCost < (visitedNodes.get(key) || Infinity)) {
                visitedNodes.set(key, newCost);
                priorityQueue.push([newCost, { row: newRow, col: newCol, direction }]);
            }
        }

        for (const newDirection of [(direction - 1 + 4) % 4, (direction + 1) % 4]) {
            const newCost = currentCost + 1000;
            const key = `${row},${col},${newDirection}`;
            if (newCost < (visitedNodes.get(key) || Infinity)) {
                visitedNodes.set(key, newCost);
                priorityQueue.push([newCost, { row, col, direction: newDirection }]);
            }
        }
    }

    return visitedNodes;
}

function backtrack(visitedNodes, endPosition, startPosition, numRows, numCols) {
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    let minCost = Infinity;

    for (let direction = 0; direction < 4; direction++) {
        const cost = visitedNodes.get(`${endPosition[0]},${endPosition[1]},${direction}`) || Infinity;
        minCost = Math.min(minCost, cost);
    }

    const path = new Set(), queue = [];

    for (let direction = 0; direction < 4; direction++) {
        const key = `${endPosition[0]},${endPosition[1]},${direction}`;
        if (visitedNodes.get(key) === minCost) {
            path.add(key);
            queue.push({ row: endPosition[0], col: endPosition[1], direction });
        }
    }

    while (queue.length) {
        const { row, col, direction } = queue.shift();
        const currentCost = visitedNodes.get(`${row},${col},${direction}`);

        const [dx, dy] = directions[direction];
        const prevRow = row - dx, prevCol = col - dy;
        if (prevRow >= 0 && prevCol >= 0 && prevRow < numRows && prevCol < numCols && grid[prevRow][prevCol] !== '#') {
            const prevCost = currentCost - 1;
            const prevKey = `${prevRow},${prevCol},${direction}`;
            if (prevCost >= 0 && visitedNodes.has(prevKey) && visitedNodes.get(prevKey) === prevCost) {
                if (!path.has(prevKey)) {
                    path.add(prevKey);
                    queue.push({ row: prevRow, col: prevCol, direction });
                }
            }
        }

        const turnCost = currentCost - 1000;
        if (turnCost >= 0) {
            for (const newDirection of [(direction - 1 + 4) % 4, (direction + 1) % 4]) {
                const prevKey = `${row},${col},${newDirection}`;
                if (visitedNodes.has(prevKey) && visitedNodes.get(prevKey) === turnCost) {
                    if (!path.has(prevKey)) {
                        path.add(prevKey);
                        queue.push({ row, col, direction: newDirection });
                    }
                }
            }
        }
    }

    path.add(`${endPosition[0]},${endPosition[1]}`);
    path.add(`${startPosition[0]},${startPosition[1]}`);

    const tiles = new Set();
    path.forEach(key => {
        const [row, col] = key.split(',').map(Number);
        tiles.add(`${row},${col}`);
    });

    return tiles;
}

function solve(part) {
    const { startPosition, endPosition, numRows, numCols } = parseGrid();
    const visitedNodes = dijkstra(startPosition, numRows, numCols);

    let minCost = Infinity;
    for (let direction = 0; direction < 4; direction++) {
        const cost = visitedNodes.get(`${endPosition[0]},${endPosition[1]},${direction}`) || Infinity;
        minCost = Math.min(minCost, cost);
    }

    if (part === 1) {
        console.log(minCost);
    } else {
        const tiles = backtrack(visitedNodes, endPosition, startPosition, numRows, numCols);
        console.log(tiles.size);
    }
}

solve(1);
solve(2);