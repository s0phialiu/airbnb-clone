// Definition of user model
const mongoose = require('mongoose');
const {Schema} = mongoose; 

const UserSchema = new mongoose.Schema({ // Schema defines structure & contents of data
    name: String,
    email: {type:String, unique:true}, // Email should be unique
    password: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;