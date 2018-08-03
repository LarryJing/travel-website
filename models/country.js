const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
  countryname: { type: String, required: true },
});

module.exports = mongoose.model('Country', CountrySchema);
