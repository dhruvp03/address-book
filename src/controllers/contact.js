// Write Controllers here
const Contact = require('../schema/ContactSchema')
const User = require('../schema/UserSchema')
const joi = require('joi')

const request_schema = joi.object({
    name: joi.string(),
    email: joi.string().email(),
    address: joi.string(),
    mobile: joi.number().max(999999999999).min(1000000000)
}) //general schema to validate incoming query data. None of them are required to increase flexibility of query

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

const addContacts = async (req,res) => {
    try{
        const contacts_body = req.body
        const mod_contacts_body = contacts_body.map(contact => ({
            ...contact,
            owner:req.user._id
        }))
        
        const contacts = await Contact.insertMany(mod_contacts_body) //Since insertmany more efficient than create
        res.status(201).send(contacts)
    }catch(e) {
        res.status(500).send(e)
    }
}

const matchingContacts = async (req,res) => {
    try {
        const { validation_error, match} = request_schema.validate(req.body)
        if (validation_error){
            res.status(400).send('Please enter a valid query')
        }
        await req.user.populate({
            path: 'contacts',
            match,
            options: {
                limit: parseInt(req.params.limit),
                skip: parseInt(req.params.skip)
            }
        }).exec();

        if(!req.user.contacts){
            return res.status(404).send()
        }

        res.status(200).send(req.user.contacts)
    }catch(e){
        res.status(500).send(e)
    }
}

const allContacts = async (req,res) => {
    try {
        await req.user.populate({
            path: 'contacts',
            options: {
                limit: parseInt(req.params.limit),
                skip: parseInt(req.params.skip)
            }
        }).exec();

        if(!req.user.contacts){
            res.status(404).send('User has no contacts')
        }

        res.status(200).send(req.user.contacts)

    }catch(e){
        res.status(500).send(e)
    }
}

const getOneContact = async (req,res) => {
    try{
        const { validation_error, query } = request_schema.validate(req.body) //validating data sent in request
        if(validation_error){
            res.status(400).send(validation_error)
        }
        
        const contact = await Contact.findOne({
            ...query,
            owner:req.user._id
        }).exec(); //Trying to get contact without populate to enhance efficiency
        
        res.status(200).send(contact)
    }catch(e){
        res.status(500).send(e)
    }
}

/* expecting req in the format {
    contact:{
        data about the contact to change
    },
    updates: {
        data about what updates to make
    }
} */

const deleteContact = async (req,res) => {
    try{
        const delete_request_schema = joi.object({
            name: joi.string(),
            email: joi.string().email(),
            address: joi.string(),
            mobile: joi.number().max(999999999999).min(1000000000).required()
        }) // requiring mobile for the sake of getting unique entry to delete!
    
        const { validation_error, query } = delete_request_schema.validate(req.body)
        
        if(validation_error){
            res.status(400).send(validation_error)
        }
    
        const contact = await Contact.findOneAndDelete({
            ...query,
            owner:req.user._id
        })
    
        if(!contact){
            return res.status(404).send()
        }
    
        res.status(200).send(contact)
    }catch(e){
        res.status(500).send(e)
    }

}

const updateContact = async (req,res) => {
    try{
        const update_request_schema = joi.object({
            contact: joi.object({
                name: joi.string(),
                email: joi.string().email(),
                address: joi.string(),
                mobile: joi.number().max(999999999999).min(1000000000).required()
            }),
            updates: joi.object({
                name: joi.string(),
                email: joi.string().email(),
                address: joi.string(),
                mobile: joi.number().max(999999999999).min(1000000000)
            })
        })
        const { validation_error, query } = update_request_schema.validate(req.body)
        if(validation_error){
            res.status(400).send(validation_error)
        }

        const contact = await Contact.findByIdAndUpdate({
            ...query.contact,
            owner:req.user._id
        },query.updates)

        if(!contact){
            res.status(400).send('Contact not found')
        }

        res.status(200).send(`${contact} successfully updated!`)
    }catch(e){
        res.status(500).send(e)
    }
    
}

module.exports = {
    addContact,
    addContacts,
    matchingContacts,
    allContacts,
    getOneContact,
    deleteContact,
    updateContact
}