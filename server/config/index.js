/* ExpressPortfolio229_Luke Nguyen_300744804_10092020  */
// Imports
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const bodyParser=require('body-parser')
const {check, validationResult} = require('express-validator')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const contactsRouter = require('../business')
const port = process.env.PORT || 8000
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('../../passport-config')
initializePassport(
    passport, 
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id),
)
const users = []


// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/../../public/css'))
app.use('/js', express.static(__dirname + '/../../public/js'))
app.use('/img', express.static(__dirname + '/../../public/img'))
app.use('/userdata', contactsRouter)
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// Set Views
app.set('views', __dirname + '/../views')
app.set('view engine', 'ejs')

// Set Templating Engine
app.use(expressLayouts)

//database setup
let mongoose = require('mongoose')
let DB = require('./db')


//point mongoose to the DB URI
mongoose.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true})

let mongoDB = mongoose.connection
mongoDB.on('error', console.error.bind(console, 'Connection Error:'))
mongoDB.once('open', ()=>{
    console.log('Connected to MongoDB...');
})


const urlencodedParser = bodyParser.urlencoded({extended: false})

//Navigation

app.set('layout', './layouts/full-width')
app.get('', (req, res) => {
    res.render('home', { title: 'Home Page'})
})

app.get('/about', (req, res) => {
    res.render('about', {title: 'About Page', layout: './layouts/sidebar'})
})

app.get('/contact', (req, res) => {
    res.render('contact', {title: 'Contact Page'})
})

app.get('/projects', (req, res) => {
        res.render('projects', {title: 'Projects Page' })
})

app.get('/services', (req, res) => {
    res.render('services', {title: 'Services Page'})
})

app.get('/userdata', (req, res) => {
    res.render('userdata/list', {title: 'Business Contacts'})
})

app.get('/login', (req, res) => {
    res.render('login', {title: 'Login'})
})

app.get('/register', checkNotAutheticated,(req, res) => {
    res.render('register', {title: 'Register'})
})


// Validation
app.post('/contact', urlencodedParser,[
    check('fullname', 'Name must be at least two characters long')
        .exists() 
        .isLength({ min: 2 }),
    
    check('email', 'Email is not valid')
        .isEmail()
        .normalizeEmail(),
    check('message', 'Message must be at least two characters long')
        .exists() 
        .isLength({ min: 2 }),       
    ], (req, res) => {
        const errors = validationResult(req)
        console.log(errors)
        if(!errors.isEmpty()){
            const alert = errors.array()
            res.render('contact', {
                alert
            })           
        }
        res.redirect("/")    
    }
)

app.post('/login', passport.authenticate ('local', {
    successRedirect: '/userdata',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', checkNotAutheticated, async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash (req.body.password, 10)
        console.log(hashedPassword)
        users.push({
            id: Date.now().toString(),
            username: req.body.username,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
})

app.get('', (req, res) => {
    res.sendFile(__dirname + '/views/home.html')
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAutheticated (req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAutheticated(req,res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

// Listen on port 8000
app.listen(port) 

