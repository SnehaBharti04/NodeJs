const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    firstName : {
        type : String,
        require: true,
    },
    lastName : {
        type : String,
        require: true,
    },
    email : {
        type : String,
        required : true,
        // unique : true,
        // trim : true,
        // minLength : 3,

    },
    password : {
        type : String,
        required : true,
       // minLength : 5,

    }
})

module.exports = mongoose.model('users', UserSchema)