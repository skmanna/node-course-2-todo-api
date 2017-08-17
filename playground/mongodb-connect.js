const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect');
    }
    console.log('Connected to Mongodb');
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert Todo');
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })
    // db.collection('Users').insertOne({
    //     name: "Mani",
    //     age: 16,
    //     location: 'Thane'
    // }, (err, result) => {
    //     if (err) return console.log('Could not insert User');
    //     //console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // })
    // db.collection('Todos').insertOne({
    //     text: 'Walk the dog',
    //     completed: false
    // }, (err, result) => {
    //     if (err) return console.log('Could not insert User');
    //     console.log(JSON.stringify(result, undefined, 2));
    // })
    db.collection('Todos').insertOne({
        text: 'Eat lunch',
        completed: false
    }, (err, result) => {
        if(err) return console.log('Could not insert User');
        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    db.close();
})
