const mongoose = require('mongoose')
const validator = require('validator')
const User = require('./UserSchema')

const contactSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    mobile:{
        type: Number,
        unique:true,
        minLength:10,
        maxLength:12 //In case people give with country code!
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Contact = mongoose.model('Contact',contactSchema)

module.exports = Contact