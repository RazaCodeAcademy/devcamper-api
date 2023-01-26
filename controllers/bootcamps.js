const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc Get all bootcamps
// @route Get /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .json(res.advancedResults);
});

// @desc Get single bootcamps
// @route Get /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    var bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400));
    }

    bootcamp = await bootcamp.populate('courses').execPopulate();

    res
        .status(200)
        .json({ success: true, data: bootcamp });
});

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // add userto req,body
    req.body.user = req.user.id;

    // check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});

    // if the user is not an admin, they can only add one bootcamp
    if(publishedBootcamp && req.user.role != 'admin'){
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
    }

    const bootcamp = await Bootcamp.create(req.body);

    res
        .status(201)
        .json({
            success: true,
            data: bootcamp,
        });
});

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);
    

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400));
    }

    // make sure user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role != 'admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
    }
  
    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res
        .status(200)
        .json({ success: true, data: bootcamp });
});

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400));
    }

    // make sure user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role != 'admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401));
    }

    bootcamp.remove();

    res
        .status(200)
        .json({ success: true, data: {} });
});

// @desc GET bootcamp with in a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // cal radius using radians
    // divide distance by radius of earth
    // earth redius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// @desc Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400));
    }

    // make sure user is bootcamp owner
    if(bootcamp.user.toString() !== req.user.id && req.user.role != 'admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
    }

    if (!req.files) {
        let str = (Math.random() + 1).toString(36).substring(7);
        var base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");
        var filename = `photo_${bootcamp._id}${str}.png`;
       
        require("fs").writeFile(`${process.env.FILE_UPLOAD_PATH}/${filename}`, base64Data, 'base64', function(err) {
        // console.log(err);
        });

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: filename });


        return res.status(200).json({
            success: true,
            data: filename
        });
        // return next(new ErrorResponse(`Please upload a file!`, 400));
    }

    const file = req.files.file;

    // make sure the iamge is photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file!`, 400));
    }

    // check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}!`, 400));
    }


    // create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {

        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`, 500))
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        })
    });

    console.log(file.name);
});


// @desc Get user bootcamp
// @route Get /api/v1/bootcamps/user/bootcamp
// @access protected
exports.getUserBootcamp = asyncHandler(async (req, res, next) => {
    var bootcamp = await Bootcamp.findOne({user: req.user.id});

    if (!bootcamp) {
        return next(new ErrorResponse(`You do not have any bootcamp`, 400));
    }

    bootcamp = await bootcamp.populate('courses').execPopulate();

    res
        .status(200)
        .json({ success: true, data: bootcamp });
});
