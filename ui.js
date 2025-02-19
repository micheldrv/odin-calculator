import { Calculator } from "./calculator.js";

function bindNumberButtons() {
  for (const button of document.querySelectorAll(".num-button")) {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      Calculator.addNumber(button.dataset.num);
      updateDisplay();
    });
  }
}

function bindOperatorButtons() {
  for (const button of document.querySelectorAll(".op-button")) {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      Calculator.setOperator(button.dataset.op);
      updateDisplay();
    });
  }
}

function bindOtherButtons() {
  document.querySelector("#del-btn").addEventListener("click", (event) => {
    event.preventDefault();
    Calculator.removeNumber();
    updateDisplay();
  });

  document.querySelector("#point-btn").addEventListener("click", (event) => {
    event.preventDefault();
    Calculator.addPoint();
    updateDisplay();
  });

  document.querySelector("#reset-btn").addEventListener("click", (event) => {
    event.preventDefault();
    Calculator.reset();
    updateDisplay();
  });

  document.querySelector("#equals-btn").addEventListener("click", (event) => {
    event.preventDefault();
    Calculator.doOperation();
    updateDisplay();
  });
}

function updateDisplay() {
  const displayTop = document.querySelector("#display-top");
  const displayMain = document.querySelector("#display-main");

  if (Calculator.error) {
    displayTop.textContent = "";
    displayMain.textContent = Calculator.error;
  } else {
    let text = [
      Calculator.numberA,
      Calculator.displayOperator(),
      Calculator.numberB,
    ]
      .join(" ")
      .trim();

    if (Calculator.result !== "") {
      displayTop.textContent = [text, "="].join(" ");
      displayMain.textContent = Calculator.result;
    } else {
      displayTop.textContent = "";
      displayMain.textContent = text ? text : "0";
    }
  }
}

export function bindButtons() {
  bindNumberButtons();
  bindOperatorButtons();
  bindOtherButtons();
}

export function bindKeyboard() {
  const KEYS = "0123456789";
  const POINT = ".,";
  const OP = {
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
  };
  document.body.addEventListener("keyup", (event) => {
    console.log(event.key);
    if (KEYS.includes(event.key)) {
      Calculator.addNumber(event.key);
      updateDisplay();
    } else if (POINT.includes(event.key)) {
      Calculator.addPoint();
      updateDisplay();
    } else if (event.key in OP) {
      Calculator.setOperator(OP[event.key]);
      updateDisplay();
    } else if (event.key == "Enter") {
      Calculator.doOperation();
      updateDisplay();
    } else if (event.key == "Backspace") {
      Calculator.removeNumber();
      updateDisplay();
    } else if (event.key == "Escape") {
      Calculator.reset();
      updateDisplay();
    }
  });
}
