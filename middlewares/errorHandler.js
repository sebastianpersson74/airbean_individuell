
export default function errorHandler(error, req, res, next) {
    console.error('Error caught by errorHandler:', error);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
}