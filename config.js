require("dotenv").config()

MONGO_URL = process.env.MONGO_URL

const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD

module.exports = {
    MONGO_URL,
    JWT_ADMIN_PASSWORD,
    JWT_USER_PASSWORD
} 
