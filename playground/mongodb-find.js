const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect');
    }
    console.log('Connected to Mongodb');
    // db.collection("Todo(s)").find({_id: new ObjectID("5995776a00f5760e08b91096")}).toArray().then((docs) => {
    //     console.log(`${docs.length} Todos`);
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // })
    db.collection('Users').find({name: 'Chotto Mani'}).toArray()
    .then((docs) => {
        console.log(docs);
    })
    .catch((err) => {
        console.log(err);
    })
    //db.close();
})
