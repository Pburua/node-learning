const family = {
  member1: "mama",
  member2: "faza",
  member3: "sista",
  member4: "braza",
};

// creating a new object from another object while omitting specific properties
// by using rest syntax inside of object destructuring 
const { member3, member4, ...parents } = family;

console.log("family", family);
console.log("parents", parents);
