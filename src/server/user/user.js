const mongoose = require('mongoose'),
  Plugins = require('../utils/plugins').Plugins,
  Schema = mongoose.Schema;

let UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  mobile: { type: String },
  otp: { type: String },//for mobile varification
  otpSentTime: { type: Date },
  gender: { type: String },
  password: { type: String },
  profilePicture: { type: String },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false }, //for email vrification
  tokenSentTime: { type: Date }, //for email vrification
  createdAt: { type: Date, default: Date.now() },
  lastUpdatedAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

UserSchema.plugin(Plugins.documentDeleted);

// Export the model
const User = mongoose.model('User', UserSchema);
module.exports = User;
