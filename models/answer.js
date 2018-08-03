const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  answer: { type: String, required: true },
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model('Answer', AnswerSchema);
