const display = document.querySelector('.display-txt');
const allButtons = document.querySelector('.buttons');
const historyLog = document.querySelector('.history-log');
const calculator ={
  displayValue: '0',
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false,
}
const PRECISION = 1e10;
const roundResult = (num) => Math.round(num * PRECISION) / PRECISION;

function updateDisplay() {
  display.textContent = calculator.displayValue;
}
updateDisplay();

allButtons.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) {
    return;
  }

  if (target.classList.contains('number')) {
    handleNumber(event.target.textContent);
  } else if (target.classList.contains('function')) {
    handleFunction(event.target.textContent);
  } else if (target.classList.contains('operator')) {
    handleOperator(event.target.textContent);
  } else if (target.classList.contains('equals')) {
    handleEquals();
  }

  updateDisplay();
  console.log(calculator);
});

const handleNumber = (digit) => {
  if (calculator.waitingForSecondOperand) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;

    if (digit === '.') {
      calculator.displayValue = '0.';
    }
    return;
  }

  if (digit === '.') {
    if (!calculator.displayValue.includes('.')) {
      calculator.displayValue += '.';
    }
    return; 
  }

  if (calculator.displayValue.length >= 16) return;

  if (calculator.displayValue === '0') {
    calculator.displayValue = digit;
  } else {
    calculator.displayValue += digit;
  }
}