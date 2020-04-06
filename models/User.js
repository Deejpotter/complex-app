const bcrypt = require('bcryptjs')
const validator = require('validator')
const usersCollection = require('../db').db().collection('users')

let User = function (data) {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function() {
    if (typeof(this.data.username) != "string") {this.data.username = ""}
    if (typeof(this.data.email) != "string") {this.data.email = ""}
    if (typeof(this.data.password) != "string") {this.data.password = ""}

    // Get rid of any bogus properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function () {
    if (this.data.username == "") {this.errors.push("You must provide a username")}
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push('Usernames can only contain letters and numbers')}
    if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide an email address")}
    if (this.data.password == "") {this.errors.push("You must provide a password")}
    if (this.data.password.length > 0 && this.data.password.length < 6) {this.errors.push("Password must be at least 6 characters")}
    if (this.data.password.length > 50) {this.errors.push("Password can not exceed 50 characters")}
    if (this.data.password.length > 0 && this.data.password.length < 3) {this.errors.push("Username must be at least 3 characters")}
    if (this.data.password.length > 30) {this.errors.push("Username can not exceed 30 characters")}
}

User.prototype.login = function () {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                resolve('Congrats')
            } else {
                reject('Invalid username or password')
            }
        }).catch(function() {
            reject('Please try again later')
        })
    })
}

User.prototype.register = function () {
    // Step 1 - Validate user data
    this.cleanUp()
    this.validate()

    // Step 2 - Only if there are no validation errors
    // then save the user data into the database
    if (!this.errors.length) {
        // Hash user password
        let salt = bcrypt.genSaltSync(10)
        this.data.password = bcrypt.hashSync(this.data.password, salt)
        usersCollection.insertOne(this.data)
    }
}

module.exports = User