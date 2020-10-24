let express = require('express');
let router = express.Router();
let mongoose = require('mongoose')

//connect to contacts model
let Contacts = require('./models/contacts')

//get route for business contacts page
router.get('/', (req, res, next) => {
    Contacts.find((err, contactList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('userdata', {title: 'Business Contacts', ContactList: contactList.map(p=>p.toJSON())})
        }
    })
})

module.exports = router;