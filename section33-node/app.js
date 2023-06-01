"use strict";
const input1Element = document.getElementById('input1');
const input2Element = document.getElementById('input2');
const buttonElement = document.getElementById('button');
// const sumResults: number[] = [];
const sumResults = [];
function add(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number')
        return num1 + num2;
    if (typeof num1 === 'string' && typeof num2 === 'string')
        return num1 + '_' + num2;
    return +num1 + +num2;
}
function printResult(result) {
    console.log(result.value);
}
buttonElement === null || buttonElement === void 0 ? void 0 : buttonElement.addEventListener('click', () => {
    const value1 = +(input1Element === null || input1Element === void 0 ? void 0 : input1Element.value);
    const value2 = +(input2Element === null || input2Element === void 0 ? void 0 : input2Element.value);
    const sum = add(value1, value2);
    const sumResult = {
        value: sum,
        date: new Date(),
    };
    printResult(sumResult);
    sumResults.push(sum);
});
const myPromise = new Promise((res, _rej) => {
    setTimeout(() => {
        res('Hello world!');
    });
});
myPromise.then((result) => {
    console.log(result);
});
