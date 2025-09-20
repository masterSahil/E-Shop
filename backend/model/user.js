const {Schema, model} = require('mongoose');

const User = new Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: "user"},
    token: {type: String, default: ""},
});

module.exports = model("UserModel", User);