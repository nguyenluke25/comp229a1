let express = require('express');
let router = express.Router();
let mongoose = require('mongoose')
const bodyparser = require('body-parser')
router.use(bodyparser.urlencoded({extended: true}))


//connect to contacts model
let Contacts = require('./models/contacts')

router.use('/css', express.static(__dirname + '/../public/css'))
//get route for business contacts page
router.get('/', (req, res, next) => {
    Contacts.find((err, contactList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('userdata/list', {title: 'Business Contacts', ContactList: contactList.map(p=>p.toJSON())})
        }
    })
})

//GET route for displaying the user REGISTER page
router.get('/add', (req, res, next) =>{
    res.render('userdata/add', {title: 'Create new contact'})
});

//POST route for processing the user REGISTER page
router.post('/add', (req, res, next) =>{
    let newContact = Contacts({
        "Name": req.body.name,
        "Contact Number": req.body.contactNumber,
        "Email Address": req.body.email
    })

    Contacts.create(newContact, (err, Contacts) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //refresh the contact list
            res.redirect('/userdata');
        }
    })
});

//GET route for displaying the user UPDATE page
router.get('/update/:id', (req, res, next) =>{
    let id = req.params.id; 

    Contacts.findById(id, (err, currentContact) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.render('userdata/update', {title: 'Update Contact Info', contact: currentContact})
        }
    })
});

//POST route for processing the user UPDATE page
router.post('/update/:id', (req, res, next) =>{
    let id = req.params.id

    let updatedContact = {
        "Name": req.body.name,
        "Contact Number": req.body.contactNumber,
        "Email Address": req.body.email
    }
    Contacts.updateOne({_id: id}, updatedContact, (err) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //refresh the contact list
            res.redirect('/userdata');
        }
    })
});

//GET route for the user DELETION page
router.get('/delete/:id', (req, res, next) =>{
    let id = req.params.id;

    Contacts.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //refresh the contact list
            res.redirect('/userdata');
        }
    })
});

module.exports = router;