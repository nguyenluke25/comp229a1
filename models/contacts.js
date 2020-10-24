let mongoose = require('mongoose')

//model class
let contactModel = mongoose.Schema({
    name: String,
    contactNumber: Number, 
    email: String
},
{
    collection: "contacts"
})

module.exports = mongoose.model('Business Contacts', contactModel);