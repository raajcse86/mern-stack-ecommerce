const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');


const  userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name'],
        maxlength: [30, 'Name cannot exceed 30 characters']
    },
    email:{
        type: String,
        required: [true, 'Please enter email '],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email addres']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        maxlength: [6, 'Password cannot exceed 6 characters'],
        select: false
    },
    avatar: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date 
});
userSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function(){
       return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME
       })
}

userSchema.methods.isValidPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

let schema = mongoose.model('User', userSchema);
module.exports = schema;