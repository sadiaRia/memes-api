'use strict';

const bcrypt = require('bcrypt'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  User = mongoose.model('User');


const _isUserExist = async (email) => {
  const user = User.findOne({ email: email }).catch((err) => {
    return {};
  });
  return user
}

const signUp = async (req, res) => {
  const email = req.body.email;
  const _existingUser = await _isUserExist(email);
  if (!_.isEmpty(_existingUser)) { return res.status(200).send("User with this email already exists"); }
  let user = req.body;
  let token = await bcrypt.hash(user.email, 9).catch((err) => { return res.status(400).send('Error in creating password hash'); })
  token = token.replace(/\//g, '&');
  token = token.replace(/\./g, '$'); // for email varification will use node mailer for now just keep it as it is
  user.verificationToken = token;
  let hash = await bcrypt.hash(user.password, 10).catch((err) => { return res.status(400).send('Error in creating password hash'); });
  user.password = hash;
  let newUser = await User.create(user).catch((err) => {
    return res.status(400).send('Failed to create user');
  });;
  return res.status(201).send(newUser);
}

const login = async (req, res) => {
  const query = {
    email: req.body.email,
  };
  const password = req.body.password;

  let user = await User.findOne(query).catch((err) => {
    return res.status(400).send('Failed to login');
  })
  if (_.isEmpty(user)) {
    return res.status(202).send('User with email not found!');
  }
  let result = await bcrypt.compare(password, user.password);
  if (!result) {
    return res.status(202).send('Invalid Login Credentials');
  }
  req.session = user; //wanted to store it on redis but for now just keet it as it is
  return res.status(200).send(user);
};


module.exports = {
  login,
  signUp
}