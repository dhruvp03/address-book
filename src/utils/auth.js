const jwt = require('jsonwebtoken')

const generateJWT = async (user) => {
    const token = jwt.sign({_id:user._id.toString()},'SecretKey123')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

module.exports = generateJWT