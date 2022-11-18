const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');

// Route files
const bootcamps = require('./routes/bootcamps'); //include file to the server.js file
const courses = require('./routes/courses'); //include file to the server.js file

// load env vars
dotenv.config({path:'./config/config.env'});

// connect to database
connectDB();

const app = express();

app.use(express.json());

app.use(logger);

app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps); //first paramerter is base_url and second is file_path
app.use('/api/v1/courses', courses); //first paramerter is base_url and second is file_path

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    // close server & exit process
    server.close(() => process.exit(1));
})