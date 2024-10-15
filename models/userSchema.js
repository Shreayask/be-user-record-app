const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt= require('bcryptjs');

let user = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true

    },
    number: {
        type: Number,
        required: true

    },
    email: {
        type: String,
        required: true

    },
    gender:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    admin:{
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
)
//middleware method securing password using bycrpt hash
user.pre('save', async function(next){
const user = this;
try{
const saltRoundValue= await bcrypt.genSalt(10);
const hash_password= await bcrypt.hash(user.password,saltRoundValue);
user.password = hash_password
}catch(error){
next(error)
}
} )



const Users = new mongoose.model('Users', user);

module.exports = Users;