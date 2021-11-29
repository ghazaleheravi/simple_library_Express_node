//we need to import models to intract with DB, and see how and what data we need 
var Author = require('../models/author');
var Book = require('../models/book');
var { body, validationResult} = require('express-validator');

var async = require('async');

// Display list of all Authors.
exports.author_list = function(req, res, next) {
  Author.find()
    .sort({family_name: 1})
    .exec(function(err, results) {
      if(err) {return next(err)}
      res.render('author_list', {title: 'Authors list:', author_list: results})
    })
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
  async.parallel({
    book: function(callback) {
      Book.find({ author: req.params.id})
        .populate('author')
        .exec(callback);
    },
    author: function(callback) {
      Author.findById({ _id: req.params.id })
        .exec(callback);
    }
  },  function(err, results) {
        if(err) {return next(err)};
        if(results.author === null) {
          var err = new Error('Author not found.');
          err.status = 404;
          return next(err);
        };
        res.render('author_detail', { title: 'author_detail', author: results.author, books: results.book });
  });
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
  res.render('author_form', { title: 'Create Author'});
};

// Handle Author create on POST.
exports.author_create_post = [
  body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.'),
  body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.'),
  body('birth_date').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('death_date').optional({ checkFalsy: true }).isISO8601().toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    console.log('err: ',errors);

    if(!errors.isEmpty()) {
      res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array()})
      return;
    } else {
      //it does not work, repetetive data added ?????
      Author.findOne({'first_name': req.body.first_name , 'family_name': req.body.family_name })
        .exec(function(err, found_author) {
          if(err) { return next(err); };
          if(found_author) {
            res.redirct(found_author.url);
          } else {
            var author = new Author(
              { first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.birth_date,
                date_of_death: req.body.death_date
              }
            );

            author.save(function(err) {
              if(err) { return next(err); }
              res.redirect(author.url);
            });
          }

        });
      }
  }
];

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};