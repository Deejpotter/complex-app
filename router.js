// This file holds all of the routes for the app.

// 
const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')

// The routes take the type of request (eg. get or post) then the location to watch for incoming requests
// (the web address) then a function to run after the request comes in

// User related routes
router.get('/', userController.home)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

// Post related routes
router.get('/create-post', userController.mustBeLoggedIn, postController.viewCreateScreen)

module.exports = router