// @desc Get all bootcamps
// @route Get /api/v1/bootcamps
// @access public
exports.getBootcamps = (req, res, next) => {
    res
    .status(200)
    .json({success: true, msg:'Show all bootcamps'});
}

// @desc Get single bootcamps
// @route Get /api/v1/bootcamps/:id
// @access public
exports.getBootcamp = (req, res, next) => {
    res
    .status(200)
    .json(`Show bootcamp ${req.params.id}`);
}

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access private
exports.createBootcamp = (req, res, next) => {
    res
    .status(200)
    .json('Create new bootcamp');
}

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