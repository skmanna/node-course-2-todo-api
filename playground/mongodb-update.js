const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect');
    }
    console.log('Connected to Mongodb');

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5995c469fa599133848edfd5')
    }, {
        $set: { name: 'Chotto Mani'},
        $inc: { age: 1}
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    });
    //db.close();
})
