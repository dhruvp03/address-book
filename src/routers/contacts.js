const express = require('express')
const contactController = require('../controllers/contact.js')
const auth = require('../middlewares/user')

const router = express.Router()

router.post('/contact',auth, contactController.addContact); //Route to add one contact

router.post('/contacts',auth, contactController.addContacts) //Route to bulk insert contacts

router.get('/contact',auth, contactController.getOneContact) //Route to get single matching contact

router.get('/contacts/:limit/:skip',auth,contactController.matchingContacts) //Route to get all matching contacts

router.get('/allContacts/:limit/:skip',auth,contactController.allContacts) //Route to get all contacts of user

router.patch('/contact',auth,contactController.updateContact) //Route to update matching contact

router.delete('/contact',auth, contactController.deleteContact) //Route to delete matching contact


module.exports = router