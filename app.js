const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./Models/User')

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
    
    newUser.save().then(userSaved => {
        res.send("User is saved")

    }).catch(err => {
        console.log("Encountered some error ", err)
         res.status(500).send("ERRROR --------", err)
    })
  console.log(newUser)

})


app.listen('4000', () => {
    console.log("Connected to server ")
})