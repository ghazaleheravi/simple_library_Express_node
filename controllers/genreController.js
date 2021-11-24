var Genre = require('../models/genre');
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

//requiring it to get access to book documents in DB for genre_detail 
var Book = require('../models/book');

var async = require('async');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
  Genre.find()
    .exec(function(err, results) {
      if(err) {return next(err);}
      res.render('genre_list', {title: 'Genres List:', genre_list: results});
    })    
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
  async.parallel({
    books: function(callback) {
      Book.find({genre: req.params.id})
        .exec(callback)
    },
    genre: function (callback) {
      Genre.findById({_id: req.params.id})  // if use find it does not work!
        .exec(callback)     
      }
  },  function(err, result) {
        if(err) {return next(err)}
        if (result.genre==null) { 
          var err = new Error('Genre not found');
          err.status = 404;
          return next(err);
      }
        res.render('genre_detail', { genre_book: result.books, genre: result.genre })
  });
}  
  

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
  res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    console.log('errors:',errors);

    var genre = new Genre(
      { name: req.body.name }
    );

    if (!errors.isEmpty()) {
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
      return;
    }
    else {
      Genre.findOne( { 'name': req.body.name })
        .exec(function(err, result) {
          if (err) { return next(err); }
          if (result) {
            res.redirect(result.url);
          }
          else {
            genre.save(function(err) {
              if(err) { return next(err); }
              res.redirect(genre.url);
            })
          }
        })
    }
  }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};