const _ = require('lodash'),
  Content = require('./content'),
  mongoose = require('mongoose'),
  config = require('../config/constants/aws'),
  uploader = require('../utils/uploader');
const ObjectId = mongoose.Types.ObjectId;

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

// - Registered users can view the statistics of uploaded memes. Statistics about the total viewed, liked 
// and blocked request.
const showUserStatistics = (req, res) => {
  let user = req.params.userId;
  let query = {
    user: ObjectId(`${user}`)
  };
  Content.aggregate([
    { $match: query },
    {
      $group:
      {
        _id: '$user',
        totalViewCount: { $sum: '$viewCount' },
        totalLikesCount: { $sum: '$likesCount' },
        totalDislikesCount: { $sum: '$dislikesCount' },
        totalBlockReqCount: { $sum: '$blockReqCount' },
      }
    }
  ], (err, result) => {
    if (err) { return res.status(400).send(err); }
    return res.status(200).send(result)
  });
}

// -normal list & also  Sort top images by top viewed & top liked count.

const list = async (req, res) => {
  let query = req.query;
  let sortCriteria = {};
  let limit = req.query.limit;
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
    delete query.limit;
  }

  if (query.viewCount) {
    sortCriteria.viewCount = -1;
    delete query.viewCount;
  } else if (query.likesCount) {
    sortCriteria.likesCount = -1;
    delete query.likesCount;
  }

  let contentList = await Content.find(query)
    .sort(sortCriteria)
    .limit(limit)
    .catch((err) => {
      return res.status(400).send('failed to get contents');
    });

  return res.status(200).send(contentList);

}

const get = async (req, res) => {
  const content = await Content.findOneAndUpdate({ _id: req.params.id }, { $inc: { viewCount: 1 } }, { new: true }).catch((err) => {
    return res.status(400).send('Failed to fetch content!');
  })
  return res.status(200).send(content);
}
// - When the user will upload an image, he can define from which site this image can be viewed. 
const isContentShareable = async (req, res) => {
  let site = req.query.site;
  const content = await Content.findById(req.params.id).catch((err) => {
    return res.status(400).send('Failed to fetch content!');
  })
  if (!content.isSiteWhiteListed) {
    return res.status(200).send(true);
  }
  if (content.whiteListedSite.includes(site)) {
    return res.status(200).send(true)
  }
  return res.status(200).send(false);
}



module.exports = {
  uploadImage,
  create,
  getImageByLink,
  addLike,
  showUserStatistics,
  list,
  get,
  isContentShareable
}