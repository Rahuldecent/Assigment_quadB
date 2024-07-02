// s3Utils.js
const AWS = require('aws-sdk');

// if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION || !process.env.AWS_S3_BUCKET_NAME) {
//     throw new Error('Missing required environment variables for AWS S3 configuration.');
// }
// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const uploadImageToS3 = async (file) => {
    if (!file) throw new Error('File is required for upload');

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `images/${Date.now()}_${file.originalname}`, // Generate a unique key for the image
        Body: file.buffer,
        ContentType: file.mimetype
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
};

module.exports = {
    uploadImageToS3,
};
