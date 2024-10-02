const jwt = require("jsonwebtoken")
const {JWT_USER_PASSWORD} = require("../config")
function userAuth(req,res,next){
    const token = req.headers.token

    const decoded = jwt.verify(token,JWT_USER_PASSWORD)
    if(decoded){
        req.userid = decoded.id
        next()
    }
    else{
        res.status(403).json({
            message:"token is invalid"
        })
    }
    
}
module.exports = userAuth
