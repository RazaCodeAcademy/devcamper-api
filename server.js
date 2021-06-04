const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');

// Route files
const bootcamps = require('./routes/bootcamps'); //include file to the server.js file

// load env vars
dotenv.config({path:'./config/config.env'});

const app = express();

app.use(logger);

// Mount routers
app.use('/api/v1/bootcamps', bootcamps); //first paramerter is base_url and second is file_path

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);