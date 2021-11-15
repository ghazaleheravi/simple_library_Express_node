const mongoose = require('mongoose');

//creating Schema in mongoose, define the shape of documents
var Schema = mongoose.Schema;

var bookSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre' }]
  }
);

bookSchema.virtual('url').get( function() {
  return '/category/book/' + this._id;
});


module.exports = mongoose.model('Book', bookSchema);