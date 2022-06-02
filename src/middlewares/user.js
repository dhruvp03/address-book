const jwt = require('jsonwebtoken')
const User = require('../schema/UserSchema')

const auth = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const { _id } = jwt.verify(token,'SecretKey123') 
        const user = await User.findOne({_id:_id, 'tokens.token':token})
        if(!user){
            throw new Error('Please register')
        }

        req.token = token
        req.user = user
    }catch(e){
        res.status(400).send('Please authenticate')
    }
    next()
}

module.exports = auth