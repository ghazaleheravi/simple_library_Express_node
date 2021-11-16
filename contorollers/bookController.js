var Book = require('../models/book');

//requiring the other models to have access to DB for the info for homepage
var Author = require('../models/author');
var BookInstance = require('../models/bookinstance');
var Genre = require('../models/genre');

//node module for asynchronous flow
var async = require('async');

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
    Book.find({})
        .select({title: 1, author: 1})
        .populate('author')
        .sort({title: 1})
        .exec(function(err, results) {
            if(err) {return next(err);}
            res.render('book_list', {title: 'Books List:', book_list: results})
        })
};

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

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