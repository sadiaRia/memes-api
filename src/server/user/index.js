const _ = require('lodash')
User = require('./user'),
bcrypt = require('bcrypt');


_isUserExist = async (email) => {
  const user = User.findOne({ email: email }).catch((err) => {
    return {};
  });
  return user
} 

create = async (req, res) => {
  const email = req.body.email;
  const _existingUser = await _isUserExist(email);
  if (!_.isEmpty(_existingUser)) { return res.status(200).send("User with this email already exists"); }
  let payload = req.body;
  let hash = await bcrypt.hash(payload.password, 10);
  payload.password = hash;

  let newUser = await User.create(req.body).catch((err) => {
    return res.status(400).send('Failed to create user');
  });;
  return res.status(201).send(newUser);
}

module.exports = {
  create
}