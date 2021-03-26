const ContentController = require("../../content");

module.exports = app => {
  app.post('/image', ContentController.uploadImage);
  app.post('/content/create', ContentController.create);  // after uploading the image user have to save it 
  app.get('/content-link', ContentController.getImageByLink);  // after uploading the image user have to save it 
  app.put('/content/add-like/:id', ContentController.addLike);  // after uploading the image user have to save it 

  app.get('/content/show-statistics/:userId', ContentController.showUserStatistics);  // after uploading the image user have to save it 



};

