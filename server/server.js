const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // console.log(req.body);
    let todo = new Todo({
        text: req.body.text
    });
    todo.save()
        .then((doc) => {
            res.send(doc)
        })
        .catch((err) => {
            res.status(400).send(err);
        });

});

app.listen(3000, () => {
    console.log(`App started on port 3000`);
});



// let newTodo = new Todo({
//     text: 'Eat dinner',
// });
//
// newTodo.save()
//     .then((doc) => {
//         console.log(`Saved: ${doc}`);
//     })
//     .catch((err) => {
//         console.log(`Error: ${err}`);
//     })
//
//
// let newUser = new User({
//     email: "  d@gmail.com       "
// });
//
// newUser.save()
//     .then((doc) => {
//         console.log(`Saved: ${doc}`);
//     })
//     .catch((err) => {
//         console.log(`Error: ${err}`);
//     });
