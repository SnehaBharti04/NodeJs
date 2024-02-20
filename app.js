const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./Models/User')
const bcrypt = require('bcryptjs')

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

mongoose.connect("mongodb://127.0.0.1/login")

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
})

app.post('/register', (req, res) => {
    const newUser = new User();
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) return console.log("EEEEERRRRRRRRR");
            newUser.password = hash;
            newUser.save().then(userSaved => {
                res.send("User is saved")
        
            }).catch(err => {
                console.log("Encountered some error ", err)
                 res.status(500).send("ERRROR --------", err)
            })
        })
    })
})

app.post('/login', (req, res) => {
    User.findOne({email : req.body.email}).then( user => {
        if(user) {
            bcrypt.compare(req.body.password, user.password, (err, matched) => {
                if (err) return err;
                    if (matched) {
                        res.send("User is matched and logged in")
                    }
                    else {
                        res.send("User is not logged in")
                    }
            })
        }
    })
})

app.listen('4000', () => {
    console.log("Connected to server ")
})