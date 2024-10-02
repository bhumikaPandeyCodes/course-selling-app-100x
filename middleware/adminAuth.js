const jwt = require("jsonwebtoken")
const JWT_ADMIN_PASSWORD = "---"


function adminAuth(req,res,next){
    //step 1: get the token from the headers
    const token = req.headers.token
    //step 2: verify the token with jwt_secret_password
    const decodedData = jwt.verify(token,JWT_ADMIN_PASSWORD)
    //step 3: get the admin in return and send back the id of admin 
    if(decodedData){
        req.id = decodedData.id
        next()
    }
    else{
        res.status(403).json({
            message: "token not found"
        })
    }
}

module.exports= {
    adminAuth
}