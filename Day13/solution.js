const fs = require('fs');

const lines = fs.readFileSync('input.txt', 'utf-8').split('\n').map(line => line.trim());

function solve(part) {
    let totalTokens = 0;
    const prizeOffset = part === 1 ? 0 : 10000000000000;
    let buttonA, buttonB;

    for (let line of lines) {
        if (line.startsWith("Button")) {
            const parts = line.split(" ");
            if (parts.length >= 4) {
                const buttonType = parts[1].split(":")[0];
                const [x, y] = parts.slice(2, 4); 
                
                if (x && y) {
                    const xCoord = parseInt(x.slice(2, -1));
                    const yCoord = parseInt(y.slice(2));
                    if (buttonType === 'A') {
                        buttonA = [xCoord, yCoord];
                    } else {
                        buttonB = [xCoord, yCoord];
                    }
                }
            }
        } else if (line.startsWith("Prize")) {
            const parts = line.split(" ");
            if (parts.length >= 3) { 
                const prizeC = parseInt(parts[1].slice(2, -1)) + prizeOffset;
                const prizeD = parseInt(parts[2].slice(2)) + prizeOffset;
                const [x1, y1] = buttonA;
                const [x2, y2] = buttonB;
                const denominator = x1 * y2 - y1 * x2;
                const coefficientA = (prizeC * y2 - prizeD * x2) / denominator;
                const coefficientB = (prizeD * x1 - prizeC * y1) / denominator;
                if (Number.isInteger(coefficientA) && Number.isInteger(coefficientB)) {
                    totalTokens += Math.floor(3 * coefficientA + coefficientB);
                }
            }
        }
    }

    console.log(totalTokens);
}

solve(1);
solve(2);
