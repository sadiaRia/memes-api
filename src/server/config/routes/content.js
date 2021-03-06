const ContentController = require("../../content");

module.exports = app => {
  app.post('/image', ContentController.uploadImage);
  app.post('/content/create', ContentController.create);  // after uploading the image user have to save it 
  app.get('/content-link', ContentController.getImageByLink);
  app.put('/content/add-like/:id', ContentController.addLike);
  app.get('/content/show-statistics/:userId', ContentController.showUserStatistics);
  app.get('/contents', ContentController.list);
  app.get('/contents/:id', ContentController.get);
  app.get('/contents/isContentShareable/:id', ContentController.isContentShareable);
  app.delete('/contents/:id', ContentController.remove);
  app.put('/contents/:id', ContentController.update);
  app.delete('/contents/:id', ContentController.remove);


};

