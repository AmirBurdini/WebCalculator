
let isSymbol;
let isParentheses;
let parameters = [0];
let str;
let index;

// enable writing
function addText(text) {

    str = document.getElementById("res").value + text;
    isParentheses = (text == '(' || text == ')'); 

    // add text only if the last key wasnt an operator
    if (!isSymbol || (!isNaN(parseInt(text))) || isParentheses) {
        document.getElementById("res").value = str;
        parameters.push(text);
    }
    
    
    isSymbol = ((isNaN(parseInt(text))) && !isParentheses);
}

// checks if the calculation is even legal
function isLegal() {

    let cnt = 0;
    let i = 0;
    let last;
    for (i; i < parameters.length; i++) {

        if (parameters[i] == '(') cnt++;
        if (parameters[i] == ')') cnt--;
    }
    last = parameters[parameters.length - 1];
    if (cnt != 0 || ( isNaN(last) && last != '(' && last != ')')) {
        return false;
    }

    return true;
}

// cleans screen
function deleteText() {
    document.getElementById("res").value = "";
    parameters = [0];
}

// equals button function
function equals() {

    if (!isLegal()) {
        alert("illegal equation");
    }
    else {
        let calc = composeNumbers();
        parameters = [handler(calc, 0)];
        document.getElementById("res").value = parameters[0];
    }
}

// auxilary func. actual calculation
function calc(num1, action, num2) {

    if (action == '+') {
        return num1 + num2;
    }

    if (action == '-') {
        return num1 - num2;
    }

    if (action == '*') {
        return  (num1 * num2);
    }
    
    if (action == '/') {
        return (num1 / num2);
    }
}

// composes the numbers out of single digits
function composeNumbers() {

    let order = [];

    let i = 1; // parameters index
    let num = 0; // auxilary variable
    let emptyNum = true; // true if last array cell was an operator
    while (i < parameters.length) {
    
        if (!isNaN(parseInt(parameters[i]))) {
            num *= 10;
            num += parameters[i];
            emptyNum = false;
        }
        else {
            if(!emptyNum) {
                order.push(num);
            }
            order.push(parameters[i]);
            num = 0;
            emptyNum = true;
        }
        i++; 
    }

    if (!emptyNum) {
        order.push(num);
    }

    return order;
}

// calculates by action order
function arithmeticOrder(parameters) {
    
    let i = 0;
    
    for (i; i < parameters.length; i++) {

        if (parameters[i] == '*' || parameters[i] == '/') {
            parameters.splice(i-1,3,calc(parameters[i-1], parameters[i], parameters[i+1]));
            i = 0;
        }

    }

    i = 0;

    for (i; i < parameters.length; i++) {

        if (parameters[i] == '+' || parameters[i] == '-') {
            parameters.splice(i-1,3,calc(parameters[i-1], parameters[i], parameters[i+1]));
            i = 0;
        }

    }

    return parameters;
}

// recursive parentheses handler
function handler(order, i) {

    let innerExp = [];
    index = i;

    for (index; index < order.length; index++) {

        if (order[index] == '(') {

            let res = handler(order, index + 1);
            innerExp.push(res[0]);
        }
        else if (order[index] == ')') {

            return arithmeticOrder(innerExp);
        }
        else {
            innerExp.push(order[index]);
        }

    }

    return arithmeticOrder(innerExp);
}