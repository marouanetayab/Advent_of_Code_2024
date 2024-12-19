const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8").trim().split("\n");
const patterns = input[0].split(", ").map((pattern) => pattern.trim());
const designs = input.slice(2).map((design) => design.trim());

function countWaysToMakeDesign(design, patterns) {
  const dp = Array(design.length + 1).fill(0);
  dp[0] = 1;

  for (let i = 1; i <= design.length; i++) {
    for (const pattern of patterns) {
      if (i >= pattern.length) {
        const substring = design.slice(i - pattern.length, i);
        if (substring === pattern) {
          dp[i] += dp[i - pattern.length];
        }
      }
    }
  }

  return dp[design.length];
}

function canMakeDesign(design, patterns) {
  const dp = Array(design.length + 1).fill(false);
  dp[0] = true;

  for (let i = 1; i <= design.length; i++) {
    for (const pattern of patterns) {
      if (i >= pattern.length && dp[i - pattern.length]) {
        const substring = design.slice(i - pattern.length, i);
        if (substring === pattern) {
          dp[i] = true;
          break;
        }
      }
    }
  }

  return dp[design.length];
}

function solve(part) {
  if (part === 1) {
    let possibleDesigns = 0;
    for (const design of designs) {
      if (canMakeDesign(design, patterns)) {
        possibleDesigns++;
      }
    }
    console.log("Part1: ", possibleDesigns);
  } else {
    let totalWays = 0;
    for (const design of designs) {
      totalWays += countWaysToMakeDesign(design, patterns);
    }
    console.log("Part2: ", totalWays);
  }
}

solve(1);
solve(2);
