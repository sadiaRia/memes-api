const ContentController = require("../../content");

module.exports = app => {
  app.post('/image' , ContentController.uploadImage);
};
