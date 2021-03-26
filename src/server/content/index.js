const _ = require('lodash'),
  Content = require('./content'),
  config = require('../config/constants/aws'),
  uploader = require('../utils/uploader');

const uploadImage = (req, res) => {
  if (!config.s3ImageConfiguration.secretAccessKey) {
    return res.status(201).send('for security purpose I can not provide all those credential if you give those credential properly code will work insha allah');
  }
  const singleUpload = uploader.upload.single('image');
  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
    }
    return res.status(201).send({ 'imageUrl': req.file.location });
  });
}

// after uploading the image user have to save it using this function
const create = async (req, res) => {
  const existingUrl = await Content.findOne({ url: req.body.url, institute: req.body.institute });
  if (existingUrl) { return res.status(400).send('Failed to create!'); }
  const newContent = await Content.create(req.body);
  return res.status(201).send(newContent);
}



module.exports = {
  uploadImage,
  create
}