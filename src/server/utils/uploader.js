const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/constants/aws');
const _ = require('lodash');


aws.config.update({
  secretAccessKey: config.s3ImageConfiguration.secretAccessKey,
  accessKeyId: config.s3ImageConfiguration.accessKey,
  region: config.s3ImageConfiguration.region
});

const s3 = new aws.S3();

const _imageFileFilter = (req, file, cb) => {
  console.log('dwd');
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

const upload = multer({
  _imageFileFilter,
  storage: multerS3({
  acl: 'public-read',
    s3,
    bucket: config.s3ImageConfiguration.bucketName,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: 'image_' + (file.originalname) + '_' + Date.now().toString() });
    },
    key: (req, file, cb) => {
      cb(null, `image_${Date.now().toString()}_${(file.originalname)}`);
    }
  })
})


module.exports = {
  upload
};


