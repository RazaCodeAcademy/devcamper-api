const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, 'Nmae can not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    website: {
        type: String,
        match: [
            /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        required: [true, "Please add a phone"],
        maxlength: [20, 'Phone can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            'Please use a valid Email'
        ]
    },
    address: {
        type: String,
        required: [true, "Please add a address"],
    },
    location:{
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere',
            sparse: true,
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers:{
        // array of strings
        type:[String],
        required:true,
        enum:[
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Others',
        ]
    },
    averageRating:{
        type:Number,
        min:[1, 'Rating must at least 1' ],
        max:[10, 'Rating must at least 10' ],
    },
    averageCost:Number,
    photo:{
        type: String,
        default: 'no-photo.jpg',
    },
    housing:{
        type: Boolean,
        default: false,
    },
    jobAssistance:{
        type: Boolean,
        default: false,
    },
    jobGuarantee:{
        type: Boolean,
        default: false,
    },
    acceptGi:{
        type: Boolean,
        default: false,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

// create bootcamp slug from the name
BootcampSchema.pre('save', function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

// geocode & create location field
BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }

    // do not save address in db
    this.address = undefined;
    next();
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);