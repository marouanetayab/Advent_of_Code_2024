const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trimEnd();

function solve(input, part) {
  const antennaPositions = {}; 
  const grid = input.split('\n');
  const antinodeGrid = grid.map(line => Array(line.length).fill(0));

  // Step 1: Record antenna positions
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const char = grid[row][col];
      if (char !== '.') {
        (antennaPositions[char] ||= []).push([row, col]);
      }
    }
  }

  for (const positions of Object.values(antennaPositions)) {
    for (let i = 0; i < positions.length - 1; i++) {
      const [row1, col1] = positions[i];
      for (let j = i + 1; j < positions.length; j++) {
        const [row2, col2] = positions[j];
        const deltaRow = row2 - row1;
        const deltaCol = col2 - col1;

        if (part === 1) {
          [[row2 + deltaRow, col2 + deltaCol], [row1 - deltaRow, col1 - deltaCol]].forEach(([y, x]) => {
            if (antinodeGrid[y]?.[x] === 0) {
              antinodeGrid[y][x] = 1;
            }
          });
        } 
        else {
          [[row2, col2, 1], [row1, col1, -1]].forEach(([startRow, startCol, direction]) => {
            while (antinodeGrid[startRow]?.[startCol] !== undefined) {
              antinodeGrid[startRow][startCol] = 1;
              startRow += deltaRow * direction;
              startCol += deltaCol * direction;
            }
          });
        }
      }
    }
  }

  const totalMarked = antinodeGrid.flat().reduce((sum, value) => sum + value, 0);
  console.log(totalMarked);
}

solve(input, 1);
solve(input, 2);
