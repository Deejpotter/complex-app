// This file holds all of the routes for the app.

// 
const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')

// The routes take the type of request (eg. get or post) then the location to watch for incoming requests
// (the web address) then a function to run after the request comes in
router.get('/', userController.home)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

module.exports = router