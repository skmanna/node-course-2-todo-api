const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const app = require ('./../server');
const Todo = require ('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());

})

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
