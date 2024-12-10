const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trimEnd();

function solve(input, part) {
  const blocks = [];
  const blockSizes = [];

  for (let i = 0; i < input.length; i++) {
    const numBlocks = +input[i];
    for (let j = 0; j < numBlocks; j++) {
      blocks.push(i % 2 === 0 ? i / 2 : -1);
      blockSizes.push(numBlocks);
    }
  }

  if (part === 1) {
    let leftIndex = 0;
    let rightIndex = blocks.length - 1;

    while (leftIndex < rightIndex) {
      while (leftIndex < blocks.length && blocks[leftIndex] !== -1) {
        leftIndex++;
      }
      while (rightIndex >= 0 && blocks[rightIndex] === -1) {
        rightIndex--;
      }

      if (leftIndex < rightIndex) {
        [blocks[leftIndex], blocks[rightIndex]] = [blocks[rightIndex], blocks[leftIndex]];
        leftIndex++;
        rightIndex--;
      }
    }
  } else if (part === 2) {
    let rightIndex = blocks.findLastIndex((n) => n !== -1);
    let leftIndex = blocks.findIndex((n, i) => n === -1 && blockSizes[i] >= blockSizes[rightIndex]);

    outer: while (true) {
      const rightBlockSize = blockSizes[rightIndex];
      const leftBlockSize = blockSizes[leftIndex];

      for (let i = 0; i < rightBlockSize; i++) {
        [blocks[leftIndex], blocks[rightIndex]] = [blocks[rightIndex], blocks[leftIndex]];
        [blockSizes[leftIndex], blockSizes[rightIndex]] = [blockSizes[rightIndex], blockSizes[leftIndex]];
        leftIndex++;
        rightIndex--;
      }

      for (let i = 0; i < leftBlockSize - rightBlockSize; i++) {
        blockSizes[leftIndex] -= rightBlockSize;
        leftIndex++;
      }

      rightIndex = blocks.findLastIndex((n, i) => n !== -1 && i <= rightIndex);
      leftIndex = blocks.findIndex(
        (n, i) => n === -1 && i < rightIndex && blockSizes[i] >= blockSizes[rightIndex]
      );

      while (leftIndex === -1) {
        rightIndex = blocks.findLastIndex(
          (n, i) => n !== -1 && i <= rightIndex - blockSizes[rightIndex]
        );
        leftIndex = blocks.findIndex(
          (n, i) => n === -1 && i < rightIndex && blockSizes[i] >= blockSizes[rightIndex]
        );

        if (rightIndex === -1) {
          break outer;
        }
      }
    }
  }

  let checksum = 0;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== -1) {
      checksum += i * blocks[i];
    }
  }

  console.log(checksum);
}

solve(input, 1);
solve(input, 2);
