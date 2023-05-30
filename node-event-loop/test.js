// EXAMPLE 1
// nextTick -> timeout -> immediate

// setTimeout(() => console.log("timeout"), 0);
// setImmediate(() => console.log("immediate"));
// process.nextTick(() => console.log("nextTick"));

// EXAMPLE 2
// timeout -> immediate OR immediate -> timeout

// setTimeout(() => console.log("timeout"), 0);
// setImmediate(() => console.log("immediate"));

// EXAMPLE 3
// nextTick -> immediate -> timeout

// const fs = require("fs");
// fs.readFile(__filename, () => {
//   setTimeout(() => console.log("timeout"), 0);
//   setImmediate(() => console.log("immediate"));
//   process.nextTick(() => console.log("nextTick"));
// });

// EXAMPLE 4
// microtask -> macrotask

setTimeout(() => console.log("macrotask"), 0);

var promise = new Promise((resolve) => {
  resolve();
}).then(() => {
  console.log("microtask");
});
