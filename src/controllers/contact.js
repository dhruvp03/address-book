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
        const contact_body = {
            ...req.body,
            owner:req.user._id
        }
        console.log(req.user._id)
        const contact = new Contact({
            ...req.body,
            owner:req.user._id
        })
        await contact.save()

        res.status(200).send({contact})
    }catch(e){
        if(e.keyValue){
            res.status(400).send("Email address and phone number must be unique.")
        }
        if(e.message){
            res.status(400).send(e.message)
        }
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
        if(e.keyValue){
            res.status(400).send("Email address and phone number must be unique.")
        }
        if(e.message){
            res.status(400).send(e.message)
        }
        res.status(500).send(e)
    }
}

const matchingContacts = async (req,res) => {
    try {
        joi.assert(req.body,request_schema)
        
        await req.user.populate({
            path: 'contacts',
            match:req.body,
            options: {
                limit: parseInt(req.params.limit),
                skip: parseInt(req.params.skip)
            }
        });

        if(!req.user.contacts){
            return res.status(404).send()
        }

        res.status(200).send(req.user.contacts)
    }catch(e){
        if(e.details){
            res.status(400).send(e.details[0].message)
        }
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
        })

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
        joi.assert(req.body, request_schema) //validating data sent in request
        
        const contact = await Contact.findOne({
            ...req.body,
            owner:req.user._id
        }).exec(); //Trying to get contact without populate to enhance efficiency
        
        res.status(200).send(contact)
    }catch(e){
        if(e.details){
            res.status(400).send(e.details[0].message)
        }
        res.status(400).send(e)
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
    
        joi.assert(req.body,delete_request_schema)
        
    
        const contact = await Contact.findOneAndDelete({
            ...req.body,
            owner:req.user._id
        })
    
        if(!contact){
            return res.status(404).send()
        }
    
        res.status(200).send(contact)
    }catch(e){
        if(e.details){
            res.status(400).send(e.details[0].message)
        }
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

        joi.assert(req.body,update_request_schema)
        
        const contact = await Contact.findOneAndUpdate({
            ...req.body.contact,
            owner:req.user._id
        }, req.body.updates)

        console.log(contact)

        if(!contact){
            res.status(400).send('Contact not found')
        }

        res.status(200).send(`${contact} successfully updated!`)
    }catch(e){
        if(e.details){
            res.status(400).send(e.details[0].message)
        }
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