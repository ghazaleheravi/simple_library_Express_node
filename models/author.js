const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var authorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    data_of_birth: {type: Date},
    data_of_death: {type: Date},
  }
);
//a virtula is a schema property that is not stored in mongoDB
//'this' is the document
//don't use arrow functions
authorSchema
.virtual('name')
.get(function () {
  return this.first_name + ' ' + this.family_name;
});

authorSchema
.virtual('lifespan')
.get( function() {
  var lifetime_string = '';
  if (this.date_of_birth) {
    lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
  }
  life_string += ' - ';
  if (this.date_of_death) {
    lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
  }
  return lifetime_string;
});

authorSchema
.virtual('url')
.get( function () {
  return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', authorSchema)