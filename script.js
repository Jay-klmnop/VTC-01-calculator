const display = document.querySelector('.display-txt');
const allButtons = document.querySelector('.buttons');
const historyLog = document.querySelector('.history-log');
const calculator ={
  displayValue: '0',
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false,
  lastOperator: null,
  lastSecondOperand: null,
}
const PRECISION = 1e10;
const roundResult = (num) => Math.round(num * PRECISION) / PRECISION;

function updateDisplay() {
  display.textContent = calculator.displayValue;
  display.innerHTML = `${calculator.displayValue}<span class="cursor">_</span>`;
  document.querySelector('.calculator-display').dataset.text = calculator.displayValue;
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
  if (digit === '00') {
    if (calculator.displayValue === '0') {
      return;
    } else if (calculator.displayValue !== '0' && calculator.waitingForSecondOperand === true) {
      return;
    } else {
      if (calculator.displayValue.length <= 14) {
        calculator.displayValue += digit;
      }
    }
  }

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

  if (digit === '00' && calculator.displayValue === '0') {

  }
}

const handleFunction = (fn) => {
  switch(fn){
    case 'CLR':
      calculator.displayValue = '0';
      calculator.firstOperand = null;
      calculator.operator = null;
      calculator.waitingForSecondOperand = false; 
      break;
    case '+/-':
      if (calculator.displayValue !== 'Error') {
        calculator.displayValue = String(parseFloat(calculator.displayValue) * -1);
      }
      break;
    case '%':
      if (calculator.displayValue !== 'Error') {
        calculator.displayValue = String(parseFloat(calculator.displayValue) / 100);
      }
      break;
  }
}

const handleOperator = (op) => {
  if (calculator.displayValue.includes('Error')) return;
  const { firstOperand, displayValue, operator } = calculator;
  
  if (operator && !calculator.waitingForSecondOperand) {
    const result = calculate(firstOperand, operator, displayValue);
    logHistory(firstOperand, operator, displayValue, result);
    calculator.displayValue = String(result);
    calculator.firstOperand = result;
  } else {
    calculator.firstOperand = displayValue;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = op;
}

const handleEquals = () => {
  if (calculator.displayValue.includes('Error')) return;
  const { 
    firstOperand, 
    displayValue, 
    operator, 
    lastOperator, 
    lastSecondOperand 
  } = calculator;

  if (operator && !calculator.waitingForSecondOperand) {
    const result = calculate(firstOperand, operator, displayValue);
    logHistory(firstOperand, operator, displayValue, result);
    calculator.displayValue = String(result);
    calculator.firstOperand = result;
    calculator.lastOperator = operator;
    calculator.lastSecondOperand = displayValue;
  } else if (lastOperator) {
    const currentDisplay = displayValue; 
    const result = calculate(displayValue, lastOperator, lastSecondOperand);
    logHistory(currentDisplay, lastOperator, lastSecondOperand, result);
    calculator.displayValue = String(result);
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = null; 
}

const calculate = (first, operator, second) => {
  const a = parseFloat(first);
  const b = parseFloat(second);
  let result;
  switch (operator) {
    case '/':
      if (b === 0) {
        return 'Error'
      }
      result = a / b;
      break;
    case '*':
      result = a * b;
      break;
    case '+':
      result = a + b;
      break
    case '-':
      result = a - b;
      break
    default:
      result = second;
    }
  if (!isFinite(result)) {
    return 'Error'
  }
  const resultString = String(roundResult(result));

  if (resultString.length > 16) {
    return 'Error: Too Large';
  }
  
  return roundResult(result);
}

const logHistory = (first, operator, second, result) => {
  const logEntry = document.createElement('p');
  logEntry.classList.add('log-entry');
  logEntry.textContent = `> ${first} ${operator} ${second}`;

  const resultEntry = document.createElement('p');
  resultEntry.classList.add('log-result');
  resultEntry.textContent = `= ${result}`;

  historyLog.prepend(resultEntry);
  historyLog.prepend(logEntry);
  if (historyLog.children.length > 10) {
    historyLog.lastChild.remove();
  }
}

function startSystemClock() {
  const clockElement = document.getElementById('system-clock');

  if (!clockElement) {
    return;
  }

  setInterval(() => {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth()).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${year}.${month}.${date} ${hours}:${minutes}:${seconds}`;
    clockElement.textContent = timeString;
  }, 1000);
}

startSystemClock();