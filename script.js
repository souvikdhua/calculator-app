// Wrap calculator logic in an object or use ES6 modules if preferred
const calculator = {
  currentExpression: '',
  lastInputWasOperator: false,
  lastInputWasEquals: false,
  displayElement: null,

  init(displayElementId) {
    this.displayElement = document.getElementById(displayElementId);
    this.updateDisplay();
  },

  appendNumber(number) {
    if (this.lastInputWasEquals) {
      this.currentExpression = '';
      this.lastInputWasEquals = false;
    }
    this.currentExpression += number;
    this.updateDisplay();
    this.lastInputWasOperator = false;
    return this.currentExpression;
  },

  appendOperator(operator) {
    if (this.currentExpression === '' && operator !== '-') {
        //this.updateDisplay(); // No change if expression is empty and not a minus
        return this.currentExpression;
    }
    if (this.lastInputWasOperator && !(operator === '-' && this.currentExpression.slice(-1) !== '-')) {
      this.currentExpression = this.currentExpression.slice(0, -1) + operator;
    } else {
      this.currentExpression += operator;
    }
    this.updateDisplay();
    this.lastInputWasOperator = true;
    this.lastInputWasEquals = false;
    return this.currentExpression;
  },

  appendDecimal() {
    if (this.lastInputWasEquals) {
      this.currentExpression = '0';
      this.lastInputWasEquals = false;
    }
    const currentSegment = this.currentExpression.split(/[\+\-\*\/]/).pop();
    if (!currentSegment.includes('.')) {
      if (this.lastInputWasOperator || this.currentExpression === '' || this.currentExpression.slice(-1).match(/[\+\-\*\/]/)) {
        this.currentExpression += '0';
      }
      this.currentExpression += '.';
      this.updateDisplay();
      this.lastInputWasOperator = false;
    }
    return this.currentExpression;
  },

  clearDisplay() {
    this.currentExpression = '';
    this.updateDisplay();
    this.lastInputWasOperator = false;
    this.lastInputWasEquals = false;
    return this.currentExpression;
  },

  deleteLast() {
    if (this.lastInputWasEquals) {
      this.clearDisplay();
      return this.currentExpression;
    }
    this.currentExpression = this.currentExpression.slice(0, -1);
    this.updateDisplay();
    if (this.currentExpression.length > 0) {
      const lastChar = this.currentExpression.slice(-1);
      this.lastInputWasOperator = ['+', '-', '*', '/'].includes(lastChar);
    } else {
      this.lastInputWasOperator = false;
    }
    return this.currentExpression;
  },

  calculateResult() {
    if (this.currentExpression === '' || (this.lastInputWasOperator && this.currentExpression.slice(-1) !== '%')) { // Allow calculation if ends with %
        //this.updateDisplay(); // No change if expression is empty or ends with operator
        return this.currentExpression; // Or return specific error/indicator?
    }

    try {
      let expressionToEvaluate = this.currentExpression;
      // Basic sanitization
      expressionToEvaluate = expressionToEvaluate.replace(/[^-()\d/*+.]/g, '');

      if (/\/0(?!\.)/.test(expressionToEvaluate)) { // Avoid flagging division by 0.5 etc.
        this.currentExpression = 'Error: Division by zero';
        this.updateDisplay();
        // currentExpression is error message, but internal state should reset for next valid input
        this.currentExpression = ''; 
        this.lastInputWasEquals = true;
        return 'Error: Division by zero';
      }

      let result = eval(expressionToEvaluate);
      result = parseFloat(result.toFixed(10));
      this.currentExpression = String(result);
      this.updateDisplay();
      this.lastInputWasOperator = false;
      this.lastInputWasEquals = true;
      return this.currentExpression;
    } catch (error) {
      this.currentExpression = 'Error';
      this.updateDisplay();
      // currentExpression is error message, but internal state should reset for next valid input
      this.currentExpression = '';
      this.lastInputWasEquals = true;
      return 'Error';
    }
  },

  updateDisplay() {
    if (this.displayElement) {
      this.displayElement.value = this.currentExpression;
    }
  },

  // Helper to reset state for tests
  resetState() {
    this.currentExpression = '';
    this.lastInputWasOperator = false;
    this.lastInputWasEquals = false;
    // this.displayElement = null; // Or re-init if needed
  }
};

// For Node.js environment (testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = calculator;
} else {
  // For browser environment
  // Initialize calculator for the browser
  document.addEventListener('DOMContentLoaded', () => {
    calculator.init('result'); 
    // Assign functions to global scope for onclick handlers in HTML
    window.appendNumber = calculator.appendNumber.bind(calculator);
    window.appendOperator = calculator.appendOperator.bind(calculator);
    window.appendDecimal = calculator.appendDecimal.bind(calculator);
    window.clearDisplay = calculator.clearDisplay.bind(calculator);
    window.deleteLast = calculator.deleteLast.bind(calculator);
    window.calculateResult = calculator.calculateResult.bind(calculator);
  });
}
