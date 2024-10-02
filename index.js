// //EXPORTING DEPENDENCIES
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const zod = require('zod')
const bcrypt = require('bcrypt')
const userRouter = require("./router/user")
const adminRouter = require("./router/admin")
const courseRouter = require("./router/course")
require("dotenv").config()
const {JWT_USER_PASSWORD} = require("./config")

// // CREATING JWT TOKEN
// const JWT_SECRET = "bhumika123"

// // AUTH MIDDLEWARE
// // function userAuth(req,res,next){
// //     const token = req.headers.token
// //     const decodedData = jwt.verify(token,JWT_SECRET)
// //     if(decodedData.username){
// //         req.username = decodedData.username
// //     }
// //     else{
// //         res.json({
// //             errorMesg: "wrong token"
// //         })
// //     }
// // }





// // EXPORTING ROUTERS

const app = express()

app.use(express.json())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/course', courseRouter)

async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000)
    console.log("listening to the 3000 port")
    // console.log(process.env.JWT_USER_PASSWORD)
    // console.log(JWT_USER_PASSWORD)
}
main()