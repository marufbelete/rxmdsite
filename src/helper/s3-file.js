const {PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const fs = require('fs');
const { PassThrough } = require('stream');
const s3 = require("../config/s3");


// AWS S3 Configuration
const bucketName = process.env.AWS_BUCKET_NAME;

// Util function to upload videos to AWS S3
async function uploadVideo(file) {
    const key=`${Date.now()}_${file.originalname}`
    const videoKey = `${process.env.AWS_FOLDER}/${key}`;
    const uploadParams = {
        Bucket: bucketName,
        Key: videoKey,
        Body: file.buffer, // Assuming the file is passed in buffer format
        ContentType: file.mimetype
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    return key;
}

// Util function to stream video from AWS S3
async function streamVideo(videoKey) {
    const getParams = {
        Bucket: bucketName,
        Key: `${process.env.AWS_FOLDER}/${videoKey}`,
    };

    const command = new GetObjectCommand(getParams);
    const { Body } = await s3.send(command);

    // Using PassThrough stream to pipe the S3 response body directly
    const passThroughStream = new PassThrough();
    Body.pipe(passThroughStream);

    return passThroughStream;
}

async function generatePresignedUrl(videoKey) {
    const getParams = {
        Bucket: bucketName,
        Key: `${process.env.AWS_FOLDER}/${videoKey}`,
    };

    const command = new GetObjectCommand(getParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL valid for 1 hour
    return url;
}

// Util function to delete video from AWS S3
async function deleteVideo(videoKey) {
    const deleteParams = {
        Bucket: bucketName,
        Key: `${process.env.AWS_FOLDER}/${videoKey}`,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);
}

module.exports = { uploadVideo, streamVideo, generatePresignedUrl, deleteVideo };
