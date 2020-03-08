module.exports={
    checkAuthentication: function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error_msg', 'You should log in first') 
    res.redirect('/users/login')
}
}