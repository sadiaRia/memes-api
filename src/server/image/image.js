const mongoose = require('mongoose'),
  Plugins = require('../utils/plugins').Plugins,
  Schema = mongoose.Schema;

let ImageSchema = new Schema({
  url: { type: String },
  likesCount: { type: Number },
  viewCount: { type: Number },
  dislikesCount: { type: Number },
  blockReqCount: { type: Number },
  dislikedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  blockReqBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isSiteWhiteListed: { type: Boolean, default: false },
  whiteListedSite: [{ type: String, enum: ['facebook', 'instagram', 'wahtsapp'] }],
  createdAt: { type: Date, default: Date.now() },
  lastUpdatedAt: { type: Date },
  deleted: { type: Boolean, default: false },
});

UserSchema.plugin(Plugins.documentDeleted);

// Export the model
const Image = mongoose.model('Image', ImageSchema);
module.exports = Image;
