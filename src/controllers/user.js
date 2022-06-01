const User = require('../schema/UserSchema')

const userCreate = async (req,res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const jwt_token = user.generateJWT()
        res.status(201).send({user,jwt_token})
    }catch(e){
        res.status(500).send(e)
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