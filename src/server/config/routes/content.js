const ContentController = require("../../content");

module.exports = app => {
  app.post('/image', ContentController.uploadImage);
  app.post('/content/create', ContentController.create);  // after uploading the image user have to save it 




};

