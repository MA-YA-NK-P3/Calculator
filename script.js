const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');

let currentInput = ''; // Stores the current number being typed
let operator = ''; // Stores the selected operator
let previousInput = ''; // Stores the first number in an operation
let result = null; // Stores the result of a calculation
let waitingForNewInput = false; // Flag to clear display after an operation or equals

// Function to update the display with the current expression
function updateDisplay() {
    if (waitingForNewInput && operator && previousInput) {
        // After an operator is pressed, show previous number + operator
        display.value = previousInput + operator;
    } else if (result !== null && operator === '' && previousInput === '') {
        // After equals, show only the result
        display.value = result;
    } else if (operator && previousInput) {
        // During an ongoing operation, show previous number + operator + current number
        display.value = previousInput + operator + currentInput;
    } else {
        // Default: show just the current input
        display.value = currentInput;
    }
    // Handle empty display
    if (display.value === '') {
        display.value = '0';
    }
}

// Function to clear all calculator state
function clearAll() {
    currentInput = '';
    operator = '';
    previousInput = '';
    result = null;
    waitingForNewInput = false;
    updateDisplay(); // Update display to '0'
}

// Function to append numbers and decimal point to the display
function appendNumber(number) {
    if (waitingForNewInput) {
        currentInput = number; // Start a new number if waiting
        waitingForNewInput = false;
    } else {
        // Prevent multiple decimal points
        if (number === '.' && currentInput.includes('.')) {
            return;
        }
        currentInput += number; // Append the number
    }
    updateDisplay(); // Update display with full expression
}

// Function to handle operator clicks
function handleOperator(nextOperator) {
    if (currentInput === '' && previousInput === '') {
        // If no input yet, but an operator is pressed (e.g., starting with '+')
        // We can optionally set currentInput to '0' or just ignore. For now, ignore.
        return;
    }

    if (previousInput === '') {
        previousInput = currentInput; // Store current input as the first number
    } else if (currentInput !== '') {
        // If there's a previous number and a current number, calculate
        calculate();
        // If result is an error, stop
        if (result === 'Error') {
            return;
        }
        previousInput = result; // Use the result as the new previous input
    }

    operator = nextOperator; // Store the new operator
    currentInput = ''; // Clear current input for the next number
    waitingForNewInput = true; // Set flag to indicate next number should be new
    updateDisplay(); // Update display to show previous number and new operator
}

// Function to perform the calculation
function calculate() {
    let num1 = parseFloat(previousInput);
    let num2 = parseFloat(currentInput);

    if (isNaN(num1) || isNaN(num2)) {
        return; // Do nothing if inputs are not valid numbers
    }

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                result = 'Error'; // Handle division by zero
            } else {
                result = num1 / num2;
            }
            break;
        default:
            return; // No valid operator
    }

    currentInput = result.toString(); // Set currentInput to result for chaining operations
    previousInput = ''; // Clear previous input
    operator = ''; // Clear operator
    waitingForNewInput = true; // Ready for new input or next operation
    updateDisplay(); // Show result on display
}

// --- Keyboard Input Handling ---
document.addEventListener('keydown', (e) => {
    const key = e.key;

    // Numbers and Decimal
    if ((key >= '0' && key <= '9') || key === '.') {
        appendNumber(key);
    }
    // Operators
    else if (key === '+' || key === '-' || key === '/' || key === '*') {
        handleOperator(key);
    }
    // Equals / Enter
    else if (key === '=' || key === 'Enter') {
        calculate();
        e.preventDefault(); // Prevent default Enter key behavior (e.g., form submission)
    }
    // Clear (Escape or Delete key)
    else if (key === 'Escape' || key === 'Delete') {
        clearAll();
    }
    // Backspace
    else if (key === 'Backspace') {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1); // Remove last character
            updateDisplay();
        } else if (operator !== '') {
            // If currentInput is empty, and an operator exists, remove operator
            operator = '';
            updateDisplay();
        } else if (previousInput !== '') {
            // If operator is empty, and previousInput exists, remove last char from previousInput
            previousInput = previousInput.slice(0, -1);
            updateDisplay();
        }
        // If all are empty, do nothing or clear all
        if (currentInput === '' && operator === '' && previousInput === '') {
            clearAll(); // Ensures display is '0' if everything is deleted
        }
    }
});


// Add event listeners to all buttons (existing logic)
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent;

        if (button.classList.contains('clear')) {
            clearAll();
        } else if (button.classList.contains('equals')) {
            calculate();
        } else if (button.classList.contains('operator')) {
            handleOperator(buttonText);
        } else {
            // It's a number or decimal point
            appendNumber(buttonText);
        }
    });
});

// Initialize display on load
clearAll();
