const calculator = require('./script.js'); // Assuming script.js is in the same directory

// Simple assertion helper
function assertEquals(actual, expected, testName) {
  if (actual === expected) {
    console.log(`PASSED: ${testName}`);
  } else {
    console.error(`FAILED: ${testName}. Expected "${expected}", but got "${actual}"`);
  }
}

// Test Suite
console.log("Running Calculator Tests...");

// --- Number Appending Tests ---
calculator.resetState();
assertEquals(calculator.appendNumber('1'), '1', 'Append first number');
assertEquals(calculator.appendNumber('2'), '12', 'Append second number');
calculator.resetState();
calculator.lastInputWasEquals = true; // Simulate state after '='
assertEquals(calculator.appendNumber('3'), '3', 'Append number after equals');
assertEquals(calculator.lastInputWasEquals, false, 'lastInputWasEquals flag reset after appending number post-equals');

// --- Operator Appending Tests ---
calculator.resetState();
assertEquals(calculator.appendOperator('+'), '', 'Append operator to empty expression (should not append)');
calculator.appendNumber('5');
assertEquals(calculator.appendOperator('+'), '5+', 'Append operator after number');
assertEquals(calculator.lastInputWasOperator, true, 'lastInputWasOperator flag set after appending operator');
assertEquals(calculator.appendOperator('-'), '5-', 'Replace operator with another operator');
assertEquals(calculator.appendOperator('*'), '5*', 'Replace operator with another operator (2)');
calculator.resetState();
assertEquals(calculator.appendOperator('-'), '-', 'Append minus to empty expression (for negative numbers)');
assertEquals(calculator.appendNumber('5'), '-5', 'Append number after leading minus');
assertEquals(calculator.appendOperator('+'), '-5+', 'Append operator after negative number');
assertEquals(calculator.appendOperator('-'), '-5-', 'Append minus operator after operator (for negative numbers)');
assertEquals(calculator.appendNumber('2'), '-5-2', 'Append number after operator and minus');


// --- Decimal Point Handling Tests ---
calculator.resetState();
assertEquals(calculator.appendDecimal(), '0.', 'Append decimal to empty expression');
assertEquals(calculator.appendNumber('5'), '0.5', 'Append number after decimal');
assertEquals(calculator.appendDecimal(), '0.5', 'Append decimal again (should not append)');
calculator.resetState();
calculator.appendNumber('1');
assertEquals(calculator.appendDecimal(), '1.', 'Append decimal after number');
assertEquals(calculator.appendNumber('23'), '1.23', 'Append numbers after decimal');
calculator.resetState();
calculator.appendNumber('1');
calculator.appendOperator('+');
assertEquals(calculator.appendDecimal(), '1+0.', 'Append decimal after operator');
assertEquals(calculator.appendNumber('5'), '1+0.5', 'Append number after decimal following operator');
calculator.resetState();
calculator.lastInputWasEquals = true; // Simulate state after '='
assertEquals(calculator.appendDecimal(), '0.', 'Append decimal after equals');


// --- Clear Display Tests ---
calculator.resetState();
calculator.appendNumber('123');
calculator.appendOperator('+');
assertEquals(calculator.clearDisplay(), '', 'Clear display');
assertEquals(calculator.lastInputWasOperator, false, 'lastInputWasOperator flag reset after clear');
assertEquals(calculator.lastInputWasEquals, false, 'lastInputWasEquals flag reset after clear');

// --- Delete Last Character Tests ---
calculator.resetState();
calculator.appendNumber('1');
calculator.appendNumber('2');
calculator.appendNumber('3');
assertEquals(calculator.deleteLast(), '12', 'Delete last number');
assertEquals(calculator.lastInputWasOperator, false, 'lastInputWasOperator after deleting number');
calculator.appendOperator('+');
assertEquals(calculator.deleteLast(), '12', 'Delete last operator');
assertEquals(calculator.lastInputWasOperator, false, 'lastInputWasOperator after deleting operator (should be false as last char is number)');
calculator.appendOperator('-');
assertEquals(calculator.lastInputWasOperator, true, 'lastInputWasOperator after adding operator');
assertEquals(calculator.deleteLast(), '12', 'Delete last operator (again)');
calculator.resetState();
calculator.appendNumber('1');
assertEquals(calculator.deleteLast(), '', 'Delete last character to empty');
assertEquals(calculator.lastInputWasOperator, false, 'lastInputWasOperator after deleting to empty');
calculator.resetState();
calculator.lastInputWasEquals = true;
calculator.currentExpression = "123"; // Simulate display after calculation
calculator.deleteLast();
assertEquals(calculator.currentExpression, "", "Delete last after equals (should clear)");


// --- Calculation Tests ---
calculator.resetState(); // 5+5
calculator.appendNumber('5');
calculator.appendOperator('+');
calculator.appendNumber('5');
assertEquals(calculator.calculateResult(), '10', 'Addition: 5+5 = 10');
assertEquals(calculator.lastInputWasEquals, true, 'lastInputWasEquals flag set after calculation');

calculator.resetState(); // 10-3
calculator.appendNumber('1');
calculator.appendNumber('0');
calculator.appendOperator('-');
calculator.appendNumber('3');
assertEquals(calculator.calculateResult(), '7', 'Subtraction: 10-3 = 7');

calculator.resetState(); // 3*6
calculator.appendNumber('3');
calculator.appendOperator('*');
calculator.appendNumber('6');
assertEquals(calculator.calculateResult(), '18', 'Multiplication: 3*6 = 18');

calculator.resetState(); // 20/4
calculator.appendNumber('2');
calculator.appendNumber('0');
calculator.appendOperator('/');
calculator.appendNumber('4');
assertEquals(calculator.calculateResult(), '5', 'Division: 20/4 = 5');

calculator.resetState(); // 1/3 (floating point)
calculator.appendNumber('1');
calculator.appendOperator('/');
calculator.appendNumber('3');
assertEquals(calculator.calculateResult(), '0.3333333333', 'Division (floating point): 1/3');

calculator.resetState(); // Order of operations: 2+3*4 = 14
calculator.appendNumber('2');
calculator.appendOperator('+');
calculator.appendNumber('3');
calculator.appendOperator('*');
calculator.appendNumber('4');
assertEquals(calculator.calculateResult(), '14', 'Order of operations: 2+3*4 = 14');

calculator.resetState(); // Calculation with negative result: 5-10
calculator.appendNumber('5');
calculator.appendOperator('-');
calculator.appendNumber('1');
calculator.appendNumber('0');
assertEquals(calculator.calculateResult(), '-5', 'Calculation with negative result: 5-10 = -5');

calculator.resetState(); // Calculation with negative input: -5+10
calculator.appendOperator('-');
calculator.appendNumber('5');
calculator.appendOperator('+');
calculator.appendNumber('1');
calculator.appendNumber('0');
assertEquals(calculator.calculateResult(), '5', 'Calculation with negative input: -5+10 = 5');

calculator.resetState(); // Calculation with multiple operators: 10-2*3+4/2 = 10-6+2 = 6
calculator.appendNumber('10');
calculator.appendOperator('-');
calculator.appendNumber('2');
calculator.appendOperator('*');
calculator.appendNumber('3');
calculator.appendOperator('+');
calculator.appendNumber('4');
calculator.appendOperator('/');
calculator.appendNumber('2');
assertEquals(calculator.calculateResult(), '6', 'Multiple operators: 10-2*3+4/2 = 6');


// --- Error Handling Tests ---
calculator.resetState(); // Division by zero
calculator.appendNumber('5');
calculator.appendOperator('/');
calculator.appendNumber('0');
assertEquals(calculator.calculateResult(), 'Error: Division by zero', 'Error Handling: Division by zero');
assertEquals(calculator.lastInputWasEquals, true, 'lastInputWasEquals flag set after division by zero error');
assertEquals(calculator.currentExpression, '', 'currentExpression reset after division by zero error for next input');

calculator.resetState(); // Invalid expression (ends with operator)
calculator.appendNumber('5');
calculator.appendOperator('+');
assertEquals(calculator.calculateResult(), '5+', 'Error Handling: Expression ends with operator (no calculation)');

calculator.resetState(); // Invalid expression (eval error, e.g. multiple operators not handled by simple eval like 5++ unless logic prevents it)
// Current logic prevents 5++ (changes to 5+), so this test might be tricky without a direct eval of "5++"
// calculator.currentExpression = '5++2'; // Force invalid state if possible (not via UI functions)
// assertEquals(calculator.calculateResult(), 'Error', 'Error Handling: Invalid expression (e.g., 5++2)');

calculator.resetState();
calculator.currentExpression = '1/0.0'; // Test division by zero with decimal
assertEquals(calculator.calculateResult(), 'Error: Division by zero', 'Error Handling: Division by 0.0');


console.log("Calculator Tests Finished.");

// To run these tests:
// 1. Save this file as script.test.js in the same directory as script.js
// 2. Open your terminal or command prompt.
// 3. Navigate to the directory where you saved the files.
// 4. Run the command: node script.test.js
// You should see PASSED or FAILED messages for each test.
// Ensure Node.js is installed on your system.
