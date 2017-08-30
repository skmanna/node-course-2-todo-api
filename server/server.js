require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const Todo = require('./models/todo');
const User = require('./models/user');
const authenticate = require('./middleware/authenticate');

let app = express();

// const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    // console.log(req.body);
    let todo = new Todo({
        text: req.body.text,    //even after routing through authenticate function, req.body is retained
        _creator: req.user._id
    });
    todo.save()
        .then((doc) => {
            res.send(doc)
        })
        .catch((err) => {
            res.status(400).send(err);
        });

});
app.get('/todos', authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id })
        .then((todos) => {
            res.send({todos});
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});
app.get('/todos/:id', authenticate, (req, res) => {

    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send();
    }
    Todo.findOne({_id: req.params.id, _creator: req.user._id})
        .then((todo) => {
            if(!todo) {
                return res.status(404).send();
            }
            res.send({todo});
        })
        .catch((err) => {
            res.status(400).send()
        });
});
app.delete('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findOneAndRemove({ _id: id, _creator: req.user._id })
        .then((todo) => {
            if(!todo) {
                return res.status(404).send();
            }
            res.send({todo});
        })
        .catch((err) => {
            res.status(400).send();
        });
});
app.patch('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, {$set: body}, {new: true})
        .then((todo) => {
            if(!todo) {
                return res.status(404).send()
            }
            res.send(todo);
        })
        .catch((err) => {
            res.status(404).send();
        })
});

//User routes

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    // console.log("Body = " + body.email + ' ' + body.password);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });
    }).catch(err => {
        res.status(400).send();
    });
})
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})
app.listen(process.env.PORT, () => {
    console.log(`App started on port ${process.env.PORT}`);
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
