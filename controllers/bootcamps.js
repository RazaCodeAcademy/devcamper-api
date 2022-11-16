const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// @desc Get all bootcamps
// @route Get /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    // copy req.query
    reqQuery = {...req.query};

    // fields to exclude
    const removeFields = ['select', 'sort', 'limit', 'page'];

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // create query string
    let queryStr = JSON.stringify(reqQuery);

    // create operator($gt, $gte,etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // finding resources
    query =  Bootcamp.find(JSON.parse(queryStr));

    // select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // sort asc name and desc -name
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort("-createdAt");
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page  * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);
    
    // execute query
    const bootcamps = await query;

    // pagination result
    const pagination = { };

    if(endIndex < total){
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res
    .status(200)
    .json({success: true, count: bootcamps.length, pagination, data: bootcamps});
});

// @desc Get single bootcamps
// @route Get /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400));
    }

    res
    .status(200)
    .json({success: true, data: bootcamp});
});

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res
    .status(201)
    .json({
        success:true,
        data:bootcamp,
    });
});

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp =  await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!bootcamp){
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400));
    }

    res
    .status(200)
    .json({success: true, data: bootcamp});
});

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp =  await Bootcamp.findByIdAndDelete(req.params.id);

    if(!bootcamp){
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400));
    }

    res
    .status(200)
    .json({success: true, data: {}});
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
        location: { $geoWithin: { $centerSphere:[[lng, lat], radius] } }
    });

    res.status(200).json({
        success:true,
        count: bootcamps.length,
        data: bootcamps
    });
});