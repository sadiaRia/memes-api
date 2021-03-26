const mongoose = require('mongoose'),
  Plugins = require('../utils/plugins').Plugins,
  Schema = mongoose.Schema;

let UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  gender: { type: String },
  password: { type: String },
  profilePicture: { type: String },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
  lastUpdatedAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

UserSchema.plugin(Plugins.documentDeleted);

// Export the model
const User = mongoose.model('User', UserSchema);
module.exports = User;
