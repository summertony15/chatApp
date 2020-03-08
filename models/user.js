const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },password: {
        type: String,
        required:true,
        minlength: 6,
        trim: true,
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User

module.exports.createUser = (newUser, cb) =>{
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash)=> {
            newUser.password = hash
            newUser.save(cb)
        })
    })
}

module.exports.getUserByUsername = (name, cb) => {
    User.findOne({name}, cb)
}

module.exports.comparePassword = (password, hash, cb) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if(err) throw err
        cb(null, isMatch)
    })
}

