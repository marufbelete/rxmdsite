const express = require("express");
const router = express.Router();

const { errorHandler } = require("../middleware/errohandling.middleware");
// const { authenticateJWT } = require("../middleware/auth.middleware");
const { addPodcast,getPodcast, getAllPodcast, removePodcast}=require("../controllers/podcastController")
const multer = require("multer");
const fileStorage = multer.memoryStorage();

const filefilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'video/mp4',
    'video/x-matroska',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'video/mpeg',
    'video/3gpp',
    'video/x-flv',
];
console.log(file.mimetype)
if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const type = file.mimetype.split("/")[1];
    req.mimetypeError = `${type} given file type is not allowed`;
    cb(
      null,
      false,
      new Error(`${type} given file type is not allowed`)
    );
  }
};
const upload = multer({ storage: fileStorage, fileFilter: filefilter });

router.post(
  "/podcast",
  upload.single("podcast"),
  addPodcast,
  errorHandler
);

router.get(
  "/podcast/:videoKey",
  getPodcast,
  errorHandler
);

router.get(
  "/podcasts",
  getAllPodcast,
  errorHandler
);

router.delete(
  "/podcast/:videoKey",
  removePodcast,
  errorHandler
);


module.exports = router;
