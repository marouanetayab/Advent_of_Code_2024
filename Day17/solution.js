const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8").trim();

function getRegisterValue(registers, operand) {
  const [registerA, registerB, registerC] = registers;
  switch (operand) {
    case 4:
      return registerA;
    case 5:
      return registerB;
    case 6:
      return registerC;
    case 7:
      throw new Error("7 reserved");
    default:
      return operand;
  }
}

function XOR(value1, value2) {
  return Number(BigInt(value1) ^ BigInt(value2));
}

const INSTRUCTIONS = [
  (registers, operand) => {
    const [registerA] = registers;
    registers[0] = Math.floor(registerA / 2 ** getRegisterValue(registers, operand));
  },

  (registers, operand) => {
    const [, registerB] = registers;
    registers[1] = XOR(registerB, operand);
  },

  (registers, operand) => {
    registers[1] = getRegisterValue(registers, operand) % 8;
  },

  (registers, operand) => {
    const [registerA] = registers;
    return registerA === 0 ? undefined : operand;
  },

  (registers) => {
    const [, registerB, registerC] = registers;
    registers[1] = XOR(registerB, registerC);
  },

  (registers, operand, output) => {
    output.push(getRegisterValue(registers, operand) % 8);
  },

  (registers, operand) => {
    const [registerA] = registers;
    registers[1] = Math.floor(registerA / 2 ** getRegisterValue(registers, operand));
  },

  (registers, operand) => {
    const [registerA] = registers;
    registers[2] = Math.floor(registerA / 2 ** getRegisterValue(registers, operand));
  },
];

function executeProgram([registerA, registerB, registerC, program]) {
  const registers = [registerA, registerB, registerC];
  let programCounter = 0;
  const output = [];
  while (programCounter < program.length - 1) {
    const instruction = INSTRUCTIONS[program[programCounter]];
    programCounter = instruction(registers, program[programCounter + 1], output) ?? programCounter + 2;
  }
  return output;
}

function solve(part) {
  const [initialRegisterA, initialRegisterB, initialRegisterC, ...program] = input.match(/\d+/g).map(Number);

  if (part === 1) {
    const output = executeProgram([initialRegisterA, initialRegisterB, initialRegisterC, program]);
    console.log(output.join());
  } else if (part === 2) {
    let possibleValuesForA = [0];
    for (let i = 0; i < program.length; i++) {
      const nextPossibleValuesForA = [];
      for (const currentA of possibleValuesForA) {
        for (let j = 0; j < 8; j++) {
          const newRegisterA = 8 * currentA + j;
          const output = executeProgram([newRegisterA, initialRegisterB, initialRegisterC, program]);
          if (output[0] === program.at(-1 - i)) {
            nextPossibleValuesForA.push(newRegisterA);
          }
        }
      }
      possibleValuesForA = nextPossibleValuesForA;
    }
    console.log(possibleValuesForA[0]);
  }
}

solve(1);
solve(2);
