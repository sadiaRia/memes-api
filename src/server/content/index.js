const _ = require('lodash'),
  Content = require('./content'),
  config = require('../config/constants/aws'),
  uploader = require('../utils/uploader');

const uploadImage = (req, res) => {
  if (!config.s3ImageConfiguration.secretAccessKey) {
    return res.status(202).send('for security purpose I can not provide all those credential if you give those credential properly code will work insha allah');
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

// - People can view  by visiting this link.
const getImageByLink = async (req, res) => {
  let url = req.query.url;
  if (!url) { return res.status(202).send('Invalid request'); }
  const content = await Content.findOneAndUpdate({ url }, { $inc: { viewCount: 1 } }, { new: true }).catch((err) => {
    return res.status(400).send('Failed to fetch content!');
  })
  return res.status(200).send(content);
}

// - People like the image by visiting this link.
const addLike = (req, res) => {
  const contentId = req.params.id;
  const likedBy = req.body.likedBy; //userId of current user

  Content.findById(contentId)
    .populate({ path: 'user', model: 'User', select: ['name'] })
    .exec((err, _content) => {
      if (err) { return res.status(400).send(err); }
      if (!_content) { return res.status(404).send('Content not fount'); }

      if (_content.likedBy.includes(likedBy)) {
        return res.status(200).send({ likesCount: _content.likesCount, likedBy: _content.likedBy })
      }

      _content.likesCount = _content.likesCount + 1;
      _content.likedBy = _content.likedBy || [];
      if (likedBy) {
        _content.likedBy.push(likedBy);
      }
      _content.save((err) => {
        if (err) { return res.status(400).send(err); }
        return res.status(200).send({ likesCount: _content.likesCount, likedBy: _content.likedBy })
      });
    });
}


module.exports = {
  uploadImage,
  create,
  getImageByLink,
  addLike
}