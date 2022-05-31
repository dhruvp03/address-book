const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    name: {
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
        minLength: 7
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
})

UserSchema.static.getUserByCreds = async (email,password) => {
    try{
        const user = User.findOne({email})

        if(!user){
            throw new Error('No such email in db!')
        }
        const isMatch = bcryptjs.compare(password,user.password)
        if (!isMatch){
            throw new Error('Invalid Password!')
        }
    }
    catch(e){
        throw new Error('Error Logging in!')
    }
}

UserSchema.methods.getJWT = async () => {
    const token = jwt.sign({_id:this._id.toString()},'SecretKey123')
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}

UserSchema.methods.toJSON = async () => {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject //Recheck this code

}

UserSchema.pre('save',async function (next){
    const user = this

    if(user.isModified(password)){
        user.password = bcryptjs.hash(password, 8)
    }

    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User