const User = require('../schema/UserSchema')
const get_jwt_token = require('../utils/auth')

const userCreate = async (req,res) => {
    const user = new User(req.body)

    try{     
        await user.save()
        const jwt_token = await get_jwt_token(user)
        const user_dict = {
            username:user.username,
            email:user.email
        }
        res.status(201).send({user_dict,jwt_token})
    }catch(e){
        res.status(500).send({"error":e})
    }
}

const userAuthenticate = async (req,res) => {
    try{
        const user = User.getUserByCreds(req.body.email,req.body.password)
        if(!user){
            res.status(404).send('User not found. Please register')
        }
        const token = user.generateJWT()

        res.status(201).send({user,token})
    }catch(e){
        res.send(e)
    }

}

module.exports = {
    userCreate,
    userAuthenticate
}