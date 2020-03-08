const express = require('express')
const User = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose')

router.get('/', (req, res) => {
    res.render('admin/addOrEdit', {
        viewTitle: "Insert user"
    })
})

router.post('/', (req,res) => {
    const {name, password} = req.body
    let errors = []
    if(!name || !password){
        errors.push({msg: 'Please fill in all fields'})
    }
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'})
    }
    if(errors.length > 0){
        res.render('admin/addOrEdit', {errors})
    }else{
        if(req.body._id == ''){
        User.findOne({name}).then(user => {
            if(user){
                errors.push({msg: 'Username has been taken'})
                res.render('admin/addOrEdit', {errors})
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
                res.redirect('/admin/list')
            }   
        })
    }else{
        User.findByIdAndUpdate({_id: req.body._id}, req.body,{new: true}).then(user =>{
            if(user){
                res.redirect('admin/list')
            }else{
                res.render('admin/addOrEdit', {
                    viewTitle: 'Update User',
                    user: req.body
                })
            }
        })
    }
    }
})

router.get('/list', async(req, res) => {
    try {
        const users = await User.find({})
        res.render('admin/list', {
            list:users
        })
    }catch(e){
        res.send(e)
    }
})

//Read user  by id
router.get('/:id', async(req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        //mongoose 就算沒找到相對應id 也不會是error，因此要反向思考
        if(!user){  
            return res.send()
        }
        res.render('admin/addOrEdit', {
            viewTitle: 'Update User',
            user: user
        })
    }catch(e){
        res.send(e)
    }
})

//Delete user
router.get('/delete/:id',  async(req, res) => {
    try{
        const user = await User.findByIdAndRemove(req.params.id)
        if(!user){
            return res.send('Error')
        }
        res.redirect('/admin/list')
    }catch(e){
        res.status(500).send(e)
    }
})


module.exports = router