const mongoose = require("mongoose");

// Creating a monggose schema for User
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength:4,
  },
  lastName: {
    type: String,
    minLength:4,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 13,
  },
  gender: {
    type: String,
    validate(value){
if(!["male", "female", "other"].includes(value.toLowerCase())){
throw new Error("Gneder data is not valid");
}
    },
  },
  photoURL: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVYCG0nML0gAjeNUVHcebvl04AHVdwuHOPNg&s",
  },
  about: {
    type: String,
    default: "Hello from my side",
  },
  skills:{
    type: [String],
  }
},{
    timestamps: true,
});

// Creating a mongoose model for User
const User = mongoose.model("User", userSchema);

module.exports = User;
