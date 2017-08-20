const {ObjectID} = require('mongodb');

const mongoose = require('../server/db/mongoose');
const Todo = require('../server/models/todo');
const User = require('../server/models/user');

// find
// findOne
// findById

const id = '599912e9ce1bcd3328d97f70';
if (!ObjectID.isValid(id)) {
    console.log(`Invalid Id: ${id}`);
}
Todo.find({
    _id: id
}).then((todos) => {
    if(!todos.length) return console.log('Id not found');
    console.log(todos);
});
Todo.findOne({
    _id: id
}).then((todo) => {
    if(!todo) return console.log('Id not found');
    console.log(todo);
});
Todo.findById(id)
    .then((todo) => {
        if (!todo) return console.log('Id not found');
        console.log(todo);
    });

const userid = '59972685162e452050144d0b';

User.find({
    _id: userid
}).then((users) => {
    if(!users.length) return console.log('Id not found');
    console.log(users);
});
User.findOne({
    _id: userid
}).then((user) => {
    if(!user) return console.log('Id not found');
    console.log(user);
});
User.findById(userid)
    .then((user) => {
        if(!user) return console.log('Id not found');
        console.log(user);
    })
