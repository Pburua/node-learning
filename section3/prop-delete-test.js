
const family = {
    member1: 'mama',
    member2: 'faza',
    member3: 'sista',
    member4: 'braza'
}

const parents = {
    ...family
}

delete parents.member3;
delete parents.member4;

console.log('family', family);
console.log('parents', parents);
