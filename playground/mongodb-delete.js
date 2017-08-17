const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect');
    }
    console.log('Connected to Mongodb');
    // db.collection('Todos').deleteOne({text: 'Eat lunch'})
    //     .then((result) => {
    //         console.log(result);
    //     })
    // db.collection('Todos').findOneAndDelete({ completed: false })
    //     .then((result) => {
    //         console.log(result);
    //     })

    // db.collection('Users').deleteMany({name: 'Mani'})
    //     .then((result) => {
    //         console.log(result);
    //     })
    db.collection('Users').findOneAndDelete({_id: new ObjectID('599579e229a8e02ca08fa367')})
        .then((result) => {
            console.log(result);
        })
    //db.close();
})
