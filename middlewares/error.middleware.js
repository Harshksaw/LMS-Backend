const errorMiddleware = (err, req, res, next){
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong !";
    req.status(err.statusCode).json({
        success:false,
        messageL err.message,
        stack: err.stack
    })
}
export default errorMiddleware;