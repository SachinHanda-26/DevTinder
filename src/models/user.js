const mongoose = require("mongoose");

// Creating a monggose schema for User
const userSchema = new mongoose.Schema({
    firstName: {type: String,},
    lastName: {type: String,},
    email: {type: String,},
    password: {type: String,},
    age: {type: Number,},
    gender: {type: String,},
});


// Creating a mongoose model for User
const User = mongoose.model("User", userSchema);

module.exports = User; 