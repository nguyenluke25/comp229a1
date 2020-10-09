// Imports
const express = require('express')
const bodyParser=require('body-parser')
const {check, validationResult} = require('express-validator')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 8000


// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')

// Set Templating Engine
app.use(expressLayouts)

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

app.post('/contact', urlencodedParser,[
    check('fullname', 'Name must be at least two characters long')
        .exists() 
        .isLength({ min: 2 }),
    
    check('email', 'Email is not valid')
        .isEmail()
        .normalizeEmail(),
    check('password')
        .custom(async (confirmPassword, {req}) => { 
            const password = req.body.password1  
            if(password !== confirmPassword){ 
              throw new Error('Passwords must be same') 
            } 
        }),
        
    
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

app.get('', (req, res) => {
    res.sendFile(__dirname + '/views/home.html')
})

// Listen on port 8000
app.listen(port) 