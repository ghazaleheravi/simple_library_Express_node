const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var bookInstanceSchema = new Schema(
  {
    book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
    imprint: {type: String, rewuired: true},
    status: {type: String, required: true, enum: ['Available', 'Loaned', 'Reserved', 'Maintenance'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

bookInstanceSchema.virtual('url').get (function () {
  return '/catalog/bookInstance/' + this._id;
});

module.exports = mongoose.model('BookInstance', bookInstanceSchema);