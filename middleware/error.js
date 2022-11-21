const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {...err};

    error.message = err.message

    // mongoose bas objectId
    if(err.name === 'CastError'){
        const message = Object.keys(err.value).length === 0 ? `Resource not found` : `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // mongoose duplicate key
    if(err.code === 11000){
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400)
    }

    // mongoose validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val=>val.message);
        error = new ErrorResponse(message, 400)
    }

    // log to console for dev
    console.log(error.message);

    res.status(error.statusCode || 500).json({
        success:false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;