const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Contact = require('./Contact')
const cors = require('cors')
const path = require('path')
var PORT = process.env.PORT || 3001

const DBURI = "mongodb+srv://vishal:2wAVKwmJqjNfYYz@cluster0-ehhln.mongodb.net/test?retryWrites=true&w=majority"

const connectDB = async ()=>{
    await mongoose.connect(DBURI,
        {useUnifiedTopology:true,
            useNewUrlParser:true,
        }).catch((error)=>{
            console.log(error)
        })
    console.log('DB Connected')
}


connectDB()
app.use(express.static(__dirname+'/phonebook/'))
var corsOptions = {
    origin: "*"
}
app.use(cors(corsOptions));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
/*

    Basics

*/

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname))
})

app.post('/api/contact',async (req,res)=>{
    
    let value = 0
    await Contact.find().countDocuments().then((count)=>{
        value = count
    }).catch((error)=>{
        res.json(error)
    })
    Contact.find().sort('name').limit(req.body.pagelimit).skip(req.body.pageoffset).exec((error,contacts)=>{
        if(error){
            res.json(['Error'])
        }else{
            res.json({data:contacts,count:value})
        }  
    })
}) 

app.post('/api/contact/filter',async(req,res)=>{
    let value = 0
    await Contact.find({ name: { $regex: req.body.filter, $options: "i" }}).sort('name').countDocuments().then((count)=>{
        value = count
    }).catch((error)=>{
        res.json(error)
    })
    Contact.find({ name: { $regex: req.body.filter, $options: "i" }}).sort('name').limit(req.body.pagelimit).skip(req.body.pageoffset).exec((error,contacts)=>{
        if(error){
            res.json(['Error'])
        }else{
            res.json({data:contacts,count:value})
        }  
    })
})


app.post('/api/new',async(req,res)=>{

    let contact = req.body.data
    let contactSave = new Contact(contact)
    contactSave.save().then(()=>{
        res.json(['New Contact Added'])
    }).catch((error)=>{
        res.json(['Error'])
    })
    
})
app.put('/api/update',(req,res)=>{
    Contact.update({_id:req.body.id},req.body.data).then((value)=>{
        res.json("0")
    }).catch((error)=>{
        res.json("1")
    })
    
})
app.post('/api/remove',(req,res)=>{
    Contact.deleteOne({'_id':req.body.id}).then((value)=>{
        res.json("0")
    }).catch((error)=>{
        res.json("1")
    })
})



app.listen(PORT, ()=>{
    console.log("Web app Running on Port 3000")
})