const input1Element = document.getElementById('input1') as HTMLInputElement;
const input2Element = document.getElementById('input2') as HTMLInputElement;
const buttonElement = document.getElementById('button') as HTMLButtonElement;

type NumOrString = number | string;
interface Result {
  value: NumOrString;
  date: Date;
}

const sumResults: number[] = [];

function add(num1: NumOrString, num2: NumOrString) {
  if (typeof num1 === 'number' && typeof num2 === 'number') return num1 + num2;
  if (typeof num1 === 'string' && typeof num2 === 'string')
    return num1 + '_' + num2;
  return +num1 + +num2;
}

function printResult(result: Result) {
  console.log(result.value);
}

buttonElement?.addEventListener('click', () => {
  const value1 = +input1Element?.value;
  const value2 = +input2Element?.value;
  const sum = add(value1, value2);
  printResult({
    value: sum,
    date: new Date(),
  });
});
