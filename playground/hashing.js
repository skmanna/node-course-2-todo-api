const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

data = {
    id: 10
}
const token = jwt.sign(data, 'abc123');
console.log(token);
const decoded = jwt.verify(token, 'abc123');

console.log(decoded);



//
// const message = 'I am user number 3';
// const hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}` );
//
// const data = {
//     id: 4
// }
// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (token.hash === resultHash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed');
// }
