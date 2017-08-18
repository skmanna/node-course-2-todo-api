const { mongoose } = require('../db/mongoose');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    }
});

module.exports = mongoose.model('User', userSchema);
