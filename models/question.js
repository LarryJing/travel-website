const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  user: { type: String },
  country: { type: Schema.Types.ObjectId, ref: 'Country' },
  points: { type: Number, default: 0 },
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  voters: [{ type: String}],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', QuestionSchema);
