
const input1Element = document.getElementById("input1") as HTMLInputElement;
const input2Element = document.getElementById("input2") as HTMLInputElement;
const buttonElement = document.getElementById("button") as HTMLButtonElement;

function add(num1: number, num2: number) {
  return num1 + num2;
}

buttonElement?.addEventListener('click', () => {
  const value1 = +input1Element?.value
  const value2 = +input2Element?.value
  console.log(add(value1, value2));
})
