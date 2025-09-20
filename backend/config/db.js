const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MongoDbUri);

        console.log("MongoDB is Connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;