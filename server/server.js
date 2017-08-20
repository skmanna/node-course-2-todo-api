const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

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
app.get('/todos', (req, res) => {
    Todo.find()
        .then((todos) => {
            res.send({todos});
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});
app.get('/todos/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send();
    }
    Todo.findById(req.params.id)
        .then((todo) => {
            if(!todo) {
                return res.status(404).send();
            }
            res.send({todo});
        })
        .catch((err) => {
            res.status(400).send()
        });
})
app.listen(3000, () => {
    console.log(`App started on port 3000`);
});

module.exports = app;


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
