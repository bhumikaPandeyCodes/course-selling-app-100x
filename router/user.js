const {Router} = require("express")
const zod = require("zod")
const bcrypt = require("bcrypt")
const {userModel,courseModel, purchaseModel} = require("../db")
const userAuth = require("../middleware/userAuth")
const jwt = require("jsonwebtoken")
const {JWT_USER_PASSWORD} = require("../config")

// -------------------------------USER DETAILS-------------------------------
// signup //
const userRouter = Router()


const saltRounds = 5
userRouter.post('/signup', async function(req,res){
    
    const requiredBody = zod.object({
        name: zod.string().min(3).max(100),
        email: zod.string().min(5).max(100).email(),
        password: zod.string().min(5).max(100)
    })

    try{
        const parseData = requiredBody.safeParse(req.body)
        
        // hashing the password
        console.log(parseData)
        const hashedPassword = await bcrypt.hash(parseData.data.password,saltRounds)
        // console.log(hashedPassword)
        const user = await userModel.create({
            name: parseData.data.name,
            email: parseData.data.email,
            password: hashedPassword
        })
        res.json({
            message:"you are signedup",
            user
        })
    //store details in db

    } catch(e){
        res.status(400)
        console.log(e)
        res.json({
            message: e
        })
    }



})

// login //
userRouter.post('/signin',async function(req,res){
    // input validation
    const requiredBody = zod.object({
        email: zod.string().min(5).max(100).email(),
        password: zod.string().min(5).max(100)
    })
    
    // middleware work: bcrypt  password

    try{
        const parseData = requiredBody.safeParse(req.body) 

        const user = await userModel.findOne({
            email: parseData.data.email,
        })
            console.log(user)
        const passwordMatch = await bcrypt.compare(parseData.data.password, user.password)
        console.log(passwordMatch)
        if(user&&passwordMatch){

            //generate jwt token
            const token = jwt.sign({
                id: user._id
            },JWT_USER_PASSWORD)
            console.log(token)

            // STORING TOKEN IN LOCALSTORAGE
            // localStorage.setItem("token", token)

            res.json({
                message: "you are logged in.",
                token
            })
        }
    }
    catch(err){
        res.status(400).json({
            message: err
        })
    }
})

// view course //
userRouter.get('/preview/all/courses',async function(req,res){
    //get from the database all the courses
    const courses = await courseModel.find()
    res.json({
        courses
    })
})


// purchase //
userRouter.post('/purchase',userAuth,async function(req,res){
    // identify that user is signin by token by userauth middleware
    const userid = req.userid

    //user input courseid
    const courseid = req.body.courseid

    // find course by courseid
    const course = await courseModel.findOne({
        _id: courseid
    })
    if(course){

        // create a new data in purchases database with course id and userid
        const purchase = await purchaseModel.create({
            courseId: course._id,
            userId: userid
        })
        
            console.log(purchase)
            res.json({
                message:"purchased "+course.title+" successfully"
            })
        
    }
    else{
        res.status(403).json({
            message: "course does not exist"
        })
    }


})

userRouter.post('/view/purchase',userAuth,async function (req,res) {
    //step1: get userid from userauth
    const userid = req.userid

    //step2: get match for userid in purchasemodel collection
    const purchases = await purchaseModel.find({
        userId: userid
    })
    // console.log(purchases)
    if(purchases){

        res.json({
            purchases
        })
    }
    else{
        res.status(403).json({
            message:"error"
        })
    }
    //
})

module.exports = userRouter