// Importing util functions
const { uploadVideo, streamVideo, deleteVideo, generatePresignedUrl } = require('../helper/s3-file');
const Podcast=require("../models/podcastModel.js")
// Controller to save podcast in S3 and URL or key of the video in DB
exports.addPodcast = async (req, res) => {
    try {
        const file = req.file; // Assuming you're using multer for file uploads
       
        const videoKey = await uploadVideo(file);
        console.log(videoKey)
        console.log(req.file)
        console.log(req.body)
        const podcast=await Podcast.create({
        video_key:videoKey,
        title:req.body.title
        })
  
        res.status(200).json(podcast);
    } catch (error) {
        console.error('Error uploading podcast:', error);
        res.status(500).json({ error: 'Failed to upload podcast' });
    }
};

// Controller to get video from S3
exports.getPodcast = async (req, res) => {
    try {
        const { videoKey } = req.params;
        const videoUrl = await generatePresignedUrl(videoKey);
        const podcast_data = await Podcast.findOne({
          where:{video_key:videoKey}
        });
        const podcast={url:videoUrl,...podcast_data}
        res.status(200).json(podcast);
    } catch (error) {
        console.error('Error streaming podcast:', error);
        res.status(500).json({ error: 'Failed to stream podcast' });
    }
};

exports.getAllPodcast = async (req, res) => {
    try {
        const podcasts = await Podcast.findAll();
       return res.status(200).json(podcasts);
    } catch (error) {
        console.error('Error streaming podcast:', error);
        res.status(500).json({ error: 'Failed to stream podcast' });
    }
};

// Controller to remove video from S3
exports.removePodcast = async (req, res) => {
    try {
        const { videoKey } = req.params;
        await deleteVideo(videoKey);
        await Podcast.destroy({where:{video_key:videoKey}});
        return res.status(200).json({ message: 'Podcast removed successfully' });
    } catch (error) {
        console.error('Error deleting podcast:', error);
        res.status(500).json({ error: 'Failed to delete podcast' });
    }
};
