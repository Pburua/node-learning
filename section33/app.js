var input1Element = document.getElementById("input1");
var input2Element = document.getElementById("input2");
var buttonElement = document.getElementById("button");
function add(num1, num2) {
    return num1 + num2;
}
buttonElement === null || buttonElement === void 0 ? void 0 : buttonElement.addEventListener('click', function () {
    var value1 = +(input1Element === null || input1Element === void 0 ? void 0 : input1Element.value);
    var value2 = +(input2Element === null || input2Element === void 0 ? void 0 : input2Element.value);
    console.log(add(value1, value2));
});
