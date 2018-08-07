const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: false },
  user: { type: String, default:"" },
  country: { type: Schema.Types.ObjectId, ref: 'Country' },
  points: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  yesno: {type: Boolean, required: true},
  voters: [{ type: Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('Post', PostSchema);
