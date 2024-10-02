//---------DEPENDENCIES---------
const {Router} = require("express")
const { hash } = require("bcrypt")
const zod = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const adminRouter = Router()
const {adminModel, courseModel} = require("../db")
const {adminAuth} = require("../middleware/adminAuth")
// const {adminModel} = require("../db")
const {JWT_ADMIN_PASSWORD} = require("../config")

const saltRounds = 5

// -------------------------------ADMIN DETAILS-------------------------------
// admin login, admin signup, create a course, delete a course, add course content.

// ADMIN SIGNUP //
adminRouter.post('/signup',async function(req,res){
    // practicing signup again

    // step 1: validate input creating a schema
    const requiredBody = zod.object({
        name: zod.string().min(4).max(100),
        email: zod.string().min(5).max(100).email(),
        password: zod.string().min(5).max(100)
    })
    // validating under try catch block
    try{
        const parseData = requiredBody.safeParse(req.body)

        //Step 2: hashing the password
        const hashedPassword = await bcrypt.hash(parseData.data.password, saltRounds)

        //Step 3: saving data into database
         await adminModel.create({
            name:parseData.data.name,
            email: parseData.data.email,
            password: hashedPassword
        })
        res.json({
           message: "you are signed up successfully!"

        })
    }
    catch(err){
        res.status(403).json({
            message: "wrong credentials try again"
        })
    }

})

// ADMIN LOGIN //
adminRouter.post('/signin',async function(req,res){
    // step 1 validating the input
        // create a schema/object
    const requiredBody = zod.object({
        email: zod.string().min(5).max(100).email(),
        password: zod.string().min(5).max(100)
    })

    try{
        const parseData = requiredBody.safeParse(req.body)
        console.log(parseData)
        // step 2 verify/check if the user is signup previously so they must be in the database
            //i check user by email and get the user
            const admin = await adminModel.findOne({
                email:parseData.data.email
            })
            
            //ii then get their password and compare it with the input password
            const passwordMatch = await bcrypt.compare(parseData.data.password, admin.password)
            
            //iii check if admin and passwordMatch are true then send the jwt
            if(admin&&passwordMatch){
            //step 3 generate  jwt token for admin
            
            const token = jwt.sign({
                id: admin._id
            },JWT_ADMIN_PASSWORD)
                console.log(token)
            //step 4  store this into local storage 
            // localStorage.setItem("token",token)
            res.json({
                token:token
            })
        }
            else{
                res.json({message: "wrong email or password"})
            }

    }
    catch(err){
        console.log(err)
        res.status(403).json({
            message: "err"
        })
    }
})

// CREATE courses //
adminRouter.post('/create-course',adminAuth,async function(req,res){
    //step 1.create a auth middleware that checks if admin token is valid and get the admin id
    const adminId = req.id
    //step 2. validate the course input by zod
        //i. creating a schema
    const requiredBody = zod.object({
        title: zod.string().min(5).max(100),
        image: zod.string().url(),
        description: zod.string(),
        price: zod.number(),

    })

    //ii. in try catch we check if validate
    try{
        const parseData = requiredBody.safeParse(req.body)
        const {title, image, description, price} = parseData.data
         //step 3. put the data into the db
       const course =  await courseModel.create({
        title: title,
        image: image,
        description: description ,
        price: price,
        admin_id: req.id
    })
    res.json({
        message:"successfully created the course",
        // course:course
    })
    }
    catch(err){
        message:"error"
    }
   
})

// DELETE courses //
adminRouter.delete('/delete-course',adminAuth,async function(req,res){
    const adminId = req.id
    const courseId = req.body.courseId
    //verify the person deltign the course is the creator of the course
    const course = await courseModel.findOne({
        _id: courseId,
        admin_id: adminId
    })
    if(course){
        //delete course
        await courseModel.deleteOne({
            _id: courseId
        })

        res.json({
            message:"deleted the course"
        })
    }
    else{

        res.status(403).json({
            message:"admin cannot access this code"
        })
    }
})


// ADD courses content //
adminRouter.put('/add-course-content',adminAuth,async function(req,res){
    //step 1:  get the admin id from adminauth
        const adminid = req.id
    //step 2: get the updated course input details
    const {title, image, description, price, courseid} = req.body
    //step 3:  find course by course id and admin id and check if the same admin who created the 
    //         course is changing the course
    const course = await courseModel.findOne({
        _id: courseid,
        admin_id: adminid
    })
    
    if(course){
      const updatedCourse =  await courseModel.updateOne({
            _id: course._id,
        },{
            title,
            image,
            description,
            price
        })
        res.json({
            updatedCourse
        })

    }
    else{
        res.status(403).json({
            message: "admin or course is wrong"
        })
    }
    //edit the course
})


// VIEW all courses //
adminRouter.get('/preview/all/courses',async function(req,res){
    //get from the database all the courses
    const courses = await courseModel.find()
    res.json({
        courses
    })
})

// VIEW their courses  //
adminRouter.get('/preview/your/courses',adminAuth,async function(req,res){
    //get admin id 
    const adminId = req.id
    //get from the database all the courses
    const courses = await courseModel.find({
        admin_id: adminId
    })
    if(courses){

        res.json({
            courses
        })
    }
    else{
        res.status(403).json({
            message:"couldtn find any course"
        })
    }
})


module.exports=adminRouter
