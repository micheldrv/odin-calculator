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

  const handleKeyDown = (buttonQuery) => {
    const button = document.querySelector(buttonQuery);
    if (button) {
      button.focus();
      button.classList.add("active");
    }
  };

  const handleKeyUp = (buttonQuery, func) => {
    const button = document.querySelector(buttonQuery);
    if (button) {
      button.classList.remove("active");
    }

    func();
    updateDisplay();
  };

  document.body.addEventListener("keydown", (event) => {
    if (KEYS.includes(event.key)) {
      handleKeyDown(`button.num-button[data-num="${event.key}"]`);
    } else if (POINT.includes(event.key)) {
      handleKeyDown("#point-btn");
    } else if (event.key in OP) {
      event.preventDefault();
      handleKeyDown(`button.op-button[data-op="${OP[event.key]}"]`);
    } else if (event.key == "=") {
      handleKeyDown("#equals-btn");
    } else if (event.key == "Enter") {
      event.preventDefault();
      handleKeyDown("#equals-btn");
    } else if (event.key == "Backspace") {
      handleKeyDown("#del-btn");
    } else if (event.key == "Escape") {
      if (!(document.activeElement instanceof HTMLButtonElement)) {
        handleKeyDown("#reset-btn");
      }
    }
  });

  document.body.addEventListener("keyup", (event) => {
    console.log(event.key);
    if (KEYS.includes(event.key)) {
      handleKeyUp(`button.num-button[data-num="${event.key}"]`, () => {
        Calculator.addNumber(event.key);
      });
    } else if (POINT.includes(event.key)) {
      handleKeyUp("#point-btn", () => {
        Calculator.addPoint();
      });
    } else if (event.key in OP) {
      handleKeyUp(`button.op-button[data-op="${OP[event.key]}"]`, () => {
        Calculator.setOperator(OP[event.key]);
      });
    } else if (event.key == "=") {
      handleKeyUp("#equals-btn", () => {
        Calculator.doOperation();
      });
    } else if (event.key == "Enter") {
      handleKeyUp("#equals-btn", () => {
        Calculator.doOperation();
      });
    } else if (event.key == "Backspace") {
      handleKeyUp("#del-btn", () => {
        Calculator.removeNumber();
      });
    } else if (event.key == "Escape") {
      if (document.activeElement instanceof HTMLButtonElement) {
        document.activeElement.classList.remove("active");
        if (document.activeElement == document.querySelector("#reset-btn")) {
          handleKeyUp("#reset-btn", () => {
            Calculator.reset();
          });
        }
        document.activeElement.blur();
      } else {
        handleKeyUp("#reset-btn", () => {
          Calculator.reset();
        });
      }
    }
  });
}
