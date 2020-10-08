// Imports
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000


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
app.set('layout', './layouts/full-width')
app.get('', (req, res) => {
    res.render('home', { title: 'Home Page'})
})

app.get('/about', (req, res) => {
    res.render('about', {title: 'About Page', layout: './layouts/sidebar'})
})

app.get('/contact', (req, res) => {
    res.render('contact', {title: 'Contact Page', layout: './layouts/sidebar'})
})



app.get('', (req, res) => {
    res.sendFile(__dirname + '/views/home.html')
})






// Listen on port 3000
app.listen(port) 