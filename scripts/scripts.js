// This version calculates the expression as it's being processed into post-fix, avoiding the need to iterate through a second array after conversion.
const pattern = /(\d+\.\d+|\d+|(?<=\))-|(?<=\D|^)-\d+|\+|\-|\*|\^|\/|\(|\))/g;
const operators = ["+", "-", "*", "/", "^"];

$("button").click(function(){
    const equation = document.getElementById('equation').value
    let workingEquation = equation.match(pattern);
    if (workingEquation) {
        workingEquation = Array.from(workingEquation); // Convert to array
        $("#scount").html(postFixConversion(workingEquation));
    } else {
        console.log("No equation or invalid format.");
    }
});

function postFixConversion(postFixThis) {
    let stack = [];
    let opStack = [];
    let postFixEquation = [];
    postFixThis.forEach(value => {
        if(operators.includes(value)) { // If the current index is an operator
           while(opEval(value) <= opEval(opStack[opStack.length-1])) { // If the operator at the top of the opStack is equal or higher importance. No need to check if it's empty, because that will return -1.
                postFixEquation.push(opStack[opStack.length-1]);
                stack.push(opStack.pop()); // Push the top of the operator stack to the expression as long as it's not an exponent
                if(stack.length >= 3) {
                    runCalc();
                }
            } 
            opStack.push(value);
        } else if(!isNaN(parseFloat(value)) || value === "(") { // If current value is a number or an opening parenthesis, push to the corresponding opStack/array.
            if(value === "(") {
                opStack.push(value);
            } else {
                stack.push(value);
                postFixEquation.push(value);
            }
        } else if(value === ")") { // If the current value is a closing parenthesis, pop operators from the opStack onto the expression until an opening parenthesis is found
            while(operators.includes(opStack[opStack.length-1])) { // While the top of the opStack is an operator (because if it isn't, it's an opening parenthesis)
                postFixEquation.push(opStack[opStack.length-1]);
                stack.push(opStack.pop());
                runCalc();
            }
            opStack.pop(); // Remove ( from stack
        }
    });
    while(opStack.length >= 1 || stack.length === 3) { // Finish popping any left over operators from the operator opStack to the expression.
        if (operators.includes(stack[stack.length - 1])) {
            runCalc();
        } else {
            postFixEquation.push(opStack[opStack.length - 1]);
            stack.push(opStack.pop());
        }
    }
    console.log(`Finished post-fixed expression:${postFixEquation}`);
    console.log(`Result of calculation: ${stack[0]}`);
    $("#expression").html(postFixEquation); // Puts the finished post-fixed expression onto the page.
    return stack[0];

    function runCalc() {
        let op = stack.pop();
        let num2 = parseFloat(stack.pop());
        let num1 = parseFloat(stack.pop());
        switch(op) {
            case "^":
                stack.push(num1**num2);
                break;
            case "*":
                stack.push(num1*num2);
                break;

            case "/":
                if(num2 == 0) {
                    console.log("Division by zero not allowed");
                    return Error;
                }
                stack.push(num1/num2);
                break;

            case "+":
                stack.push(parseFloat(num1)+parseFloat(num2)); // REMEMBER + ON STRINGS WILL CONCAT THEM SO THEY MUST BE CONVERTED
                break;

            case "-":
                stack.push(num1-num2);
                break;
        }

    }

}

function opEval(op) {
    if(op === "+" || op === "-") {
        return 1;
    } else if(op === "*" || op === "/") {
        return 2;
    } else if(op === "^") {
        return 3;
    } else {
        return -1;
    }
}