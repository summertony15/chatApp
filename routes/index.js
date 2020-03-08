const express = require('express')
const router = express.Router()
const {checkAuthentication} = require('../config/auth')

//Home page
router.get('/', (req, res) => res.render('index')
)

//Chat page(Authenticated)
router.get('/chat', checkAuthentication, (req, res)=> 
    res.render('chat', {
        name: req.user.name //pass name to template
}))


module.exports = router