const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = 'secret';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(`Hash: ${hash}`);
//     })
// })

hashedPassword = '$2a$10$qh0fUYWcYVBZlw8veEv4S.PFzBweF36aZWbkhGxtqVNWMEgSON0am';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

// data = {
//     id: 10
// }
// const token = jwt.sign(data, 'abc123');
// console.log(token);
// const decoded = jwt.verify(token, 'abc123');
//
// console.log(decoded);



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
