const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {...err};

    error.message = err.message

    // mongoose bas objectId
    if(err.name === 'CastError'){
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // log to console for dev
    console.log(error.message);

    res.status(error.statusCode || 500).json({
        success:false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;