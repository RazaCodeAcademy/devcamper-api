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
    } catch (error) {
        res
        .status(400)
        .json({success: false});
    }
}

// @desc Get single bootcamps
// @route Get /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = async(req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            res
            .status(400)
            .json({success: false});
        }

        res
        .status(200)
        .json({success: true, data: bootcamp});
    } catch (error) {
        res
        .status(400)
        .json({success: false});
    }
}

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = async(req, res, next) => {

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
exports.updateBootcamp = (req, res, next) => {
    res
    .status(200)
    .json(`Update bootcamp ${req.params.id}`);
}

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access private
exports.deleteBootcamp = (req, res, next) => {
    res
    .status(200)
    .json(`Delete bootcamp ${req.params.id}`);
}