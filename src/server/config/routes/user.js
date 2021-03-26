const UserController = require("../../user");

module.exports = app => {
  app.post("/users", UserController.create);
};
