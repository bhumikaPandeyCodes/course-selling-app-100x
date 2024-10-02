const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ObjectID = mongoose.Types.ObjectId

//user schema
const user = new Schema({

    name: String,
    email: {type:String , unique:true},
    password: String
})

const admin = new Schema({

    name: String,
    email: {type:String , unique:true},
    password: String
})

const course = new Schema({

    title: String,
    image: String,
    description: String,
    price: Number,
    admin_id: {type: ObjectID , ref: 'admin'}

})

const purchase = new Schema({
    courseId: ObjectID,
    userId: ObjectID
})

const userModel = mongoose.model('users', user)
const adminModel = mongoose.model('admin', admin)
const courseModel = mongoose.model('course', course)
const purchaseModel = mongoose.model('purchase', purchase)

module.exports= {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}
