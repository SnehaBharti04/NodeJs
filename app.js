const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./Models/User')
const bcrypt = require('bcryptjs')
const path = require('path')
const exphbs  = require('express-handlebars') 


// middleware
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static(path.join(__dirname, 'public')))


// set view engine
app.engine('handlebars', exphbs.engine({defaultLayout: 'home'}))
app.set('view engine', 'handlebars');


//load routes
const home = require('./routes/home/index')
const admin = require('./routes/admin/index')

//use routes
app.use('/', home);
app.use('/admin', admin);


app.listen('4000', () => {
    console.log("Connected to server ")
})