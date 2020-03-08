const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//register page
router.get('/register', (req, res) => {
    res.render('register')
})

//login page
router.get('/login', (req, res) => {
    res.render('login')
})

//register
router.post('/register', (req, res) => {
    const {name, password} = req.body
    //Validation
    let errors = []
    if(!name || !password){
        errors.push({msg: 'Please fill in all fields'})
    }
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'})
    }
    if(errors.length > 0){
        res.render('register', {errors})
    }else{
        User.findOne({name}).then(user => {
            if(user){
                errors.push({msg: 'Username has been taken'})
                res.render('register', {errors})
            }else{
                const newUser = new User({
                    name,
                    password
                })
                User.createUser(newUser, (err, user) => {
                    if(err) throw err
                    console.log(user)
                })
                req.flash('success_msg', 'Register Success and can login')
                res.redirect('/users/login')
            }   
        })
    }
})

//Login
router.post('/login', (req, res) => {
    passport.authenticate('local', {
    successRedirect: '/chat',
    failureRedirect: '/users/login',
    failureFlash: true
})(req, res)
})

//Logout
router.get('/logout', (req, res) => {
    req.logOut()

    req.flash('success_msg', 'You have logged out successfully')

    res.redirect('/users/login')
})

module.exports = router