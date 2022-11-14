
const mongoose =  require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});

const connectDB = async() => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`mongoDB Connected: ${conn.connection.host}`);
}

module.exports = connectDB;