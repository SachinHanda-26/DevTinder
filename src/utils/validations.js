const validator = require("validator");
const { validate } = require("../models/user");

const validateSignUpData = (req)=>{
const {firstName, lastName, password, email} = req.body;

if(!firstName || !lastName){
    throw new Error("Name is not correct");
}

else if(!validator.isEmail(email)){
    throw new Error("Email is not correct");
}

else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong enough");

}
}

const validateProfileUpdateData = (req)=>{
    const allowedUpdates = ["firstName", "lastName", "age", "gender", "skills", "photoURL", "about"];

   const isEditAllowed = Object.keys(req.body).every(update => allowedUpdates.includes(update));

   return isEditAllowed;
}

module.exports = {validateSignUpData, validateProfileUpdateData};