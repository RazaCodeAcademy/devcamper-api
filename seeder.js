const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load env vars
dotenv.config({ path: './config/config.env' });

// load models
const Bootcamp = require('./models/Bootcamp');

// connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// read json files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

const importData = async () => {
    try{
        await Bootcamp.create(bootcamps);
        console.log('Data Imported...');
        process.exit();
    }catch(err){
        console.error(err);
    }
}

// delete data
const deleteData = async () => {
    try{
        await Bootcamp.deleteMany();
        console.log('Data Destroyed...');
        process.exit();
    }catch(err){
        console.error(err);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}