// const speakeasy = require('speakeasy')
// const qrcode = require('qrcode')

// var secret = speakeasy.generateSecret({
//     name: "Haitham"
// })

// console.log(secret)

// qrcode.toDataURL(secret.otpauth_url, function(err,url){
//     console.log(url)
// })

const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://localhost:27017/stage')

const UserSchema = mongoose.Schema({
    email: String,
    pasword: String
})

const UserModel = mongoose.model("users",UserSchema)

app.get("/getUsers", (req , res) =>{
    UserModel.find({}).then(function(users){
        res.json(users)
    }).catch(function(err){
        console.log(err)
    })
})

app.listen(3001, ()=>{
    console.log("server is running")
})