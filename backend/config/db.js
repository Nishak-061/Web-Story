const mongoose = require ("mongoose");

const connectDB = async () => {
    try{
const conn = await mongoose.connect(process.env.MONGO_URL)
console.log("Connection to mongodb")
    } catch(error) {
console.log("Error in MONGODB")
    }
}


module.exports = connectDB;