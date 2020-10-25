let mongoose = require('mongoose')

//model class
let contactModel = mongoose.Schema({
    "Name": String,
    "Contact Number": Number, 
    "Email Address": String
},
{
    collection: "contacts"
})

module.exports = mongoose.model('Business Contacts', contactModel);