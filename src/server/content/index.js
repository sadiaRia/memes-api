const _ = require('lodash'),
  Content = require('./content'),
  config = require('../config/constants/aws'),
  uploader = require('../utils/uploader');

async function uploadImage(req, res) {
  if (!config.s3ImageConfiguration.secretAccessKey) {
    return res.status(201).send('for security purpose I can not provide all those info if you give those credential properly code will work insha allah');
  }
  const singleUpload = await uploader.upload.single('image');
  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
    }
    return res.status(201).send({ 'imageUrl': req.file.location });
  });
}





module.exports = {
  uploadImage
}