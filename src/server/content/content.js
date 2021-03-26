const mongoose = require('mongoose'),
  Plugins = require('../utils/plugins').Plugins,
  Schema = mongoose.Schema;

let ContentSchema = new Schema({
  url: { type: String },
  likesCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  dislikesCount: { type: Number, default: 0 },
  blockReqCount: { type: Number, default: 0 },
  dislikedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  blockReqBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isSiteWhiteListed: { type: Boolean, default: false },
  whiteListedSite: [{ type: String, enum: ['facebook', 'instagram', 'wahtsapp'] }],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now() },
  lastUpdatedAt: { type: Date },
  deleted: { type: Boolean, default: false },
});

ContentSchema.plugin(Plugins.documentDeleted);

// Export the model
const Content = mongoose.model('Content', ContentSchema);
module.exports = Content;
