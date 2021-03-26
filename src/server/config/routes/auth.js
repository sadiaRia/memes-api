const AuthController = require("../../auth");

module.exports = app => {
  app.post("/api/auth/sign-up", AuthController.signUp);
};
