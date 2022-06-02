const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Contact = require('./ContactSchema')
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }

    },
    password: {
        type: String,
        trim: true,
        minLength: 7,
        required:true
    },
    tokens: [{
        token:{
            type: String,
        }
    }]
})

UserSchema.virtual('contacts', {
    ref: 'Contact',
    localField: '_id',
    foreignField:'owner'
})

UserSchema.statics.getUserByCreds = async (email,password) => {
    try{
        const user = User.findOne({email})

        if(!user){
            throw new Error('No such email in db!')
        }
        const isMatch = bcryptjs.compare(password,user.password)
        if (!isMatch){
            throw new Error('Invalid Password!')
        }
        return user
    }
    catch(e){
        throw new Error('Error Logging in!')
    }
}




UserSchema.pre('save',async function (next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcryptjs.hash(user.password, 8)

    }

    next()
})

UserSchema.pre('remove', async function(next){
    const user = this

    await Contact.deleteMany({user:user._id})
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User