const ALLOWED_OPERATORS = ["add", "subtract", "multiply", "divide"];
const PRECISION_THRESHOLD = 7;
const MAX_LENGTH = 18;

export class Calculator {
  operator = "";
  numberA = "";
  numberB = "";
  result = "";
  error = "";

  static {
    this.reset();
  }

  static reset() {
    this.operator = "";
    this.numberA = "";
    this.numberB = "";
    this.result = "";
    this.error = "";
  }

  static isValidNum(number) {
    return number === "" || isFinite(number);
  }

  static doOperation() {
    this.updateError();

    if (this.error) {
      return;
    }

    if (this.numberB !== "" && this.operator !== "") {
      if (this.result) {
        this.numberA = this.result;
      }

      const result = this.operate(
        this.operator,
        parseFloat(this.numberA),
        parseFloat(this.numberB)
      );

      this.result = result;
      if (this.result.length > MAX_LENGTH) {
        this.error = "TOO BIG";
      }
    }
  }

  static setOperator(operator) {
    if (this.error) {
      this.reset();
    }

    if (!this.canAddCharacter()) {
      return;
    }

    if (ALLOWED_OPERATORS.includes(operator)) {
      this.updateResult();

      if (this.numberB !== "") {
        this.doOperation();
        this.updateResult();
        this.updateError();
      }

      this.operator = operator;

      if (this.numberA == "" || this.numberA.endsWith(".")) {
        this.numberA += "0";
      }
    }
  }

  static removeLeadingZeroes(number) {
    number = number.toString();
    while (number.startsWith("0") && number.length > 1) {
      number = number.slice(1);
    }
    if (number.startsWith(".")) {
      number = `0${number}`;
    }
    return number;
  }

  static updateResult() {
    if (this.result) {
      this.numberA = this.result;
      this.operator = "";
      this.numberB = "";
      this.result = "";
    }
  }

  static updateError() {
    if (this.isValidNum(this.numberA)) {
      if (this.isValidNum(this.numberB)) {
        if (this.isValidNum(this.result)) {
          this.error = "";
        }
      }
    }
  }

  static operateNumber(func) {
    this.updateResult();

    let num = this.numberA;
    let isNumberA = true;

    if (this.operator !== "") {
      isNumberA = false;
      num = this.numberB;
    }

    if (!this.isValidNum(num) || this.error) {
      this.reset();
      num = "";
    }

    const temp = func(num, isNumberA);
    if (temp !== undefined) {
      num = temp;
    }

    if (isNumberA) {
      this.numberA = num;
    } else {
      this.numberB = num;
    }

    this.updateError();
  }

  static canAddCharacter() {
    if (this.error) return false;

    if (this.numberB !== "") {
      return this.numberA.length + 2 + this.numberB.length < MAX_LENGTH;
    }

    if (this.operator != "") {
      return this.numberA.length + 2 < MAX_LENGTH;
    }

    return this.numberA.length < MAX_LENGTH;
  }

  static addNumber(number) {
    this.operateNumber((num) => {
      if (!this.isValidNum(num)) {
        num = "";
      }

      if (this.canAddCharacter()) {
        num += number.toString();
        num = this.removeLeadingZeroes(num);
      }

      return num;
    });
  }

  static addPoint() {
    this.operateNumber((num) => {
      if (this.canAddCharacter()) {
        if (!num.includes(".")) {
          if (num == "") {
            num = "0.";
          } else {
            num += ".";
          }
        }
      }
      return num;
    });
  }

  static removeNumber() {
    debugger;
    this.operateNumber((num, isNumberA) => {
      if (!isNumberA && num === "") {
        this.operator = "";
      } else if (num !== "") {
        num = num.slice(0, -1);
      }
      return num;
    });
  }

  static add(a, b) {
    return a + b;
  }

  static subtract(a, b) {
    return a - b;
  }

  static multiply(a, b) {
    return a * b;
  }

  static divide(a, b) {
    if (parseFloat(b) === 0) {
      this.error = "Cannot divide by zero";
      return NaN;
    }
    return a / b;
  }

  static operate(operator, a, b) {
    let result = "";
    switch (operator) {
      case "add":
        result = Calculator.add(a, b).toString();
        break;
      case "subtract":
        result = Calculator.subtract(a, b).toString();
        break;
      case "multiply":
        result = Calculator.multiply(a, b).toString();
        break;
      case "divide":
        result = Calculator.divide(a, b).toString();
        break;
    }

    // very crude "fix" to floating point imprecision
    if (result.includes(".")) {
      const wholePart = result.split(".")[0];
      const decimalPart = result.split(".")[1];
      const zeroes = "0".repeat(PRECISION_THRESHOLD);
      if (decimalPart.includes(zeroes)) {
        result = `${wholePart}.${decimalPart.split(zeroes)[0]}`;
        result = parseFloat(result).toString();
      }
    }

    return result;
  }

  static displayOperator() {
    switch (this.operator) {
      case "add":
        return "+";
      case "subtract":
        return "-";
      case "multiply":
        return "x";
      case "divide":
        return "/";
    }
    return "";
  }
}
