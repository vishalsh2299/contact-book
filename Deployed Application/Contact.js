const mongoose = require('mongoose')

const contact  = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    dob:{
        type:String,
        require:false
    },
    phonenumbers:[{
        number:String
    }],
    emailid:[{
        emailid:String
    }]
})

module.exports = Contact = mongoose.model('contact',contact)