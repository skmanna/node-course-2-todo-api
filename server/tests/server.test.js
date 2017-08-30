const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require ('./../server');
const Todo = require ('./../models/todo');
const User = require ('./../models/user');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    const text = 'Test todo text';

    it('should create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text === text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find({text})
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch((err) => done(err));
            });
    });
    it('should not create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({text: "   "})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find({})
                    .then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch((err) => done(err));
            });
    });
});
describe('GET /todos', () => {
    it('should return all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});
describe('GET /todos/:id', () => {
    it('should return a specific todo', (done) => {
        const id = todos[0]._id.toString();//'59992f6899291742bcadb8ee';
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('should return a 404 for incorrect id', (done) => {
        const id = new ObjectID().toString(); // a valid but non-existent id
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });
    it('should return a 404 for invalid id', (done) => {
        const id = 'asdfdlfjsofjfj';
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });
});
describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const id = todos[1]._id.toString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(id)
                    .then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch((err) => done(err))
            });
    });
    it('should return a 404 if no todo is deleted', (done) => {
        const id = new ObjectID().toString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('should return a 404 if invalid id is sent', (done) => {
        const id = 'dkjfijfoe';
        request(app)
            .delete(`/todo/${id}`)
            .expect(404)
            .end(done);
    });
});
describe('PATCH /todos/:id', () => {

    it('should update a todo', (done) => {
        const id_1 = todos[0]._id.toString();
        const text = 'First test todo modified';
        request(app)
            .patch(`/todos/${id_1}`)
            .send({text, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
                expect(res.body.completed).toBe(true);
                expect(res.body.completedAt).toBeA('number');
            })
            .end((err, res) => {
                if(err) return done(err);
                Todo.findById(id_1)
                    .then((todo) => {
                        expect(todo.text).toBe('First test todo modified');
                        expect(todo.completed).toBe(true);
                        expect(todo.completedAt).toBeA('number');
                        done();
                    })
                    .catch((err) => done(err));
            })
    });
    it('should clear completedAt when completed is set to false', (done) => {
        const id_2 = todos[1]._id.toString();
        request(app)
            .patch(`/todos/${id_2}`)
            .send({completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.completed).toBe(false);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(id_2)
                    .then((todo) => {
                        expect(todo.completed).toBe(false);
                        expect(todo.completedAt).toNotExist();
                        done();
                    })
                    .catch((err) => done(err));
            })
    })
    it('should return a 404 if no todo is deleted', (done) => {
        const id = new ObjectID().toString();
        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
    it('should return a 404 if invalid id id passed', (done) => {
        const id = 'fjdjfjfjdj';
        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = 'password!';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should return validation errors if email invalid', (done) => {
        let email = 'example@example';
        let password = 'password!';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);

    });
    it('should return validation errors id password invalid', (done) => {
        let email = 'example1@example.com';
        let password = 'pas';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
    it('should not send a duplicate email', (done) => {
        let email = users[0].email;
        let password = 'password!';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);

    });
});
describe('POST /users/login', () => {
    it('should login user and return auth token', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + 'x'
            })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if((err) => {
                    return done(err);
                })
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});






///
