var Book = require('../models/book');

var mongoose = require('mongoose');

//requiring the other models to have access to DB for the info for homepage
var Author = require('../models/author');
var BookInstance = require('../models/bookinstance');
var Genre = require('../models/genre');

//node module for asynchronous flow
var async = require('async');
const { body, validationResult } = require('express-validator');

// this is route_handler for home page '/' or '/catalog' 
//we want to show count of all the documents(books,authors,bookinstanses,genres)
exports.index = function(req, res, next) {
  async.parallel({
    books_count: function(callback) {
      Book.countDocuments({}, callback); 
    },
    authors_count: function(callback) {
      Author.countDocuments({}, callback);
    }, 
    bookInstance_count: function(callback) {
      BookInstance.countDocuments({}, callback);
    },
    bookInstance_available_count: function(callback) {
      BookInstance.countDocuments({status:'Available'}, callback);
    },
    genre_count: function(callback){
      Genre.countDocuments({}, callback);
    }
  },  function(err, results) {
        if(err) {return next(err)};
        res.render('index', {title: 'Welcome to My local library', data: results});
      });
};

// Display list of all books.
exports.book_list = function(req, res, next) {
  Book.find()
    .select({title: 1, author: 1})
    .populate('author')
    .sort({title: 1})
    .exec(function(err, results) {
      if(err) {return next(err);}
      res.render('book_list', {title: 'Books List:', book_list: results});
    });
};

// Display detail page for a specific book.s
exports.book_detail = function(req, res, next) {
  var id = mongoose.Types.ObjectId(req.params.id);
  async.parallel({
    book: function(callback) {
      Book.findById({ _id: id })
        .populate('author')
        .populate('genre') 
        .exec(callback);
    },
    copy: function(callback) {
      BookInstance.find({ book: id })
        .exec(callback);
    }
  },  function(err, results) {
        if(err) {return next(err)}
        if(results.book === null) {
          var err = new Error('Book not found');
          err.status = 404;
          return next(err);
        }
        res.render('book_detail', { book: results.book, copies: results.copy})
  });
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {
    async.parallel({
      authors: function(callback) {
        Author.find(callback);
      },
      genres: function(callback) {
        Genre.find(callback);
      },
    }, function(err, results) {
        if (err) {return next(err);}
        res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres});
    });
};

// Handle book create on POST.
exports.book_create_post = [

  (req, res, next) => {
    if(!(req.body.genre instanceof Array)) {
      if(typeof req.body.genre === 'undefined'){
      req.body.genre = [];
      }
      else {
      req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  body('title', 'Title must not be empty').trim().isLength({ min: 1}).escape(),
  body('author', 'Author must not be empty').trim().isLength({ min: 1}).escape(),
  body('summary', 'Summary must not be empty').trim().isLength({ min: 1}).escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1}).escape(),
  // * character --also known as a wildcard-- apply same rules to all items of an array 
  body('genre.*').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre
    });

    if (!errors.isEmpty()) {
      async.parallel({
        authors: function(callback) {
          Author.find(callback);
        },
        genres: function(callback) {
          Genre.find(callback);
        }
      }, function(err, results) {
          if(err) { return next(err); }

          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked='true';
            }
          }

          res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
      });
      return;
    }
    else {
      book.save(function (err) {
        if (err) { return next(err); }
        res.redirect(book.url);
      });
    }
  }
];
 
  

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};