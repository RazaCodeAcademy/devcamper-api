const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

// @desc Get all bootcamps
// @route Get /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();

        res
        .status(200)
        .json({success: true, data: bootcamps});
    } catch (err) {
        res
        .status(400)
        .json({success: false});
    }
}

// @desc Get single bootcamps
// @route Get /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400));
        }

        res
        .status(200)
        .json({success: true, data: bootcamp});
    } catch (err) {
        next(err);
    }
}

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = async (req, res, next) => {

    try{
        const bootcamp = await Bootcamp.create(req.body);
        res
        .status(201)
        .json({
            success:true,
            data:bootcamp,
        });
    } catch(err){
        res
        .status(400)
        .json({success:false});
    };

    
};

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access private
exports.updateBootcamp = async (req, res, next) => {
    try{
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
    } catch(err){
        next(err);
    };
}

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = async (req, res, next) => {
    try{
        const bootcamp =  await Bootcamp.findByIdAndDelete(req.params.id);

        if(!bootcamp){
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400));
        }

        res
        .status(200)
        .json({success: true, data: {}});
    } catch(err){
        next(err);
    };
}