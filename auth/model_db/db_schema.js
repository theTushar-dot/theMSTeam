const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// structure for mongoDB database

let userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    tasks: {
        type: String
    }
}, {
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema)