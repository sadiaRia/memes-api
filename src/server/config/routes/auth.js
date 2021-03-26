const AuthController = require("../../auth");

module.exports = app => {
  app.post("/api/auth/sign-up", AuthController.signUp);
  app.post("/api/auth/login", AuthController.login);
};
