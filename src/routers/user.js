const express = require('express')
const { route } = require('express/lib/application')

const userController = require('../controllers/user')

const router = new express.Router()
//User Creation!

router.post('/user',userController.userCreate) //Route to create user

router.post('/user/login',userController.userAuthenticate) //Route to authenticate user