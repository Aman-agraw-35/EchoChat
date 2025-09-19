import multer from 'multer';

// Configure multer for handling file uploads with memory storage
const storage = multer.memoryStorage();

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Please upload only image files (JPEG, PNG, etc.).'), false);
    }
};

// Error handling middleware
const errorHandler = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File is too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            message: error.message
        });
    }
    next(error);
};

// Create the multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export { upload, errorHandler };