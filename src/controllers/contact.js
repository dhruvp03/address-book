// Write Controllers here
const Contact = require('../schema/ContactSchema')
const User = require('../schema/UserSchema')

const addContact = async (req,res) => {
    try{
        const contact = new Contact({
            ...req.body,
            owner:req.user._id
        })
        await contact.save()

        res.status(200).send({contact})
    }catch(e){
        res.status(500).send(e)
    }
}