const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');

function processStones(frequencyMap) {
    let newFrequencyMap = {};

    for (let stone in frequencyMap) {
        const count = frequencyMap[stone];
        const numStone = parseInt(stone, 10);

        if (stone === '0') {
            newFrequencyMap['1'] = (newFrequencyMap['1'] || 0) + count;
        } else if (numStone.toString().length % 2 === 0) {
            const mid = stone.length / 2;
            const left = parseInt(stone.slice(0, mid), 10) || 0;
            const right = parseInt(stone.slice(mid), 10) || 0;
            newFrequencyMap[left] = (newFrequencyMap[left] || 0) + count;
            newFrequencyMap[right] = (newFrequencyMap[right] || 0) + count;
        } else {
            const newStone = numStone * 2024;
            newFrequencyMap[newStone] = (newFrequencyMap[newStone] || 0) + count;
        }
    }

    return newFrequencyMap;
}

function solve(blinks) {
    let stones = input.split(/\s+/).map(Number);
    let frequencyMap = {};

    for (let stone of stones) {
        frequencyMap[stone] = (frequencyMap[stone] || 0) + 1;
    }

    for (let i = 0; i < blinks; i++) {
        frequencyMap = processStones(frequencyMap);
    }

    console.log(Object.values(frequencyMap).reduce((sum, count) => sum + count, 0));
}

solve(25);

solve(75);

