const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const socketio = require('socket.io')
const MongoClient = require('mongodb').MongoClient

//Init app
const app = express()

//passport config
require('./config/passport')(passport)

//View 
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout: 'layout'}))
app.set('view engine', 'handlebars')

//MongoDB
const db = require('./config/keys').mongoURI
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

//BodyParser MiddleWare
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cookieParser())

//Set Static Floder
app.use(express.static(path.join(__dirname, '/public')))

//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}))

//passport init
app.use(passport.initialize());
app.use(passport.session());


//Connect flash
app.use(flash())


//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
  })

//Router
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


const port = process.env.PORT || 5000

//HTTP server
const http = require('http').createServer(app);

//generatemessage
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    } 
}

  
//socket io
const io = socketio(http)

io.on('connection', (socket) => {
    socket.emit('message', generateMessage('Admin', 'Welcome'))
    socket.broadcast.emit('message', generateMessage('Admin', 'New user joined'))

    socket.on('sendMessage', (message, callback)=> {
        //To every client
        io.emit('message', generateMessage('username', message))
        callback()
    })

        socket.on('disconnect', () => {
        io.emit('message', generateMessage('username', 'A user has leaved'))
    })
})



http.listen(port, () => {
    console.log(`Server is up on ${port}`)
})