/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {
  var list = [
    'you',
    'should',
    'definitely',
    'hire',
    'me',
    'after',
    'all',
    'I',
    'am',
    'exceptionally',
    'awesome',
    'and',
    'seems',
    'like',
    'You',
    'could',
    'always',
    'use',
    'such',
    'an',
    'addition',
    'to',
    'the',
    'team!'
  ]
  var links = {};

  // Helper to add links
  var addLink = function(link) {
    for (var i = 0; i < list.length; i++) {
      if (links[list[i]] === undefined) {
        links[list[i]] = link;
        return list[i];
      }
    }
    concatLinks();
    return addLink(link)
  };

  // Adds more links to the list
  var concatLinks = function() {
    for (var i = list.length - 1; i >= 0; i--) {
      list[i] += '_';
    }
  } 
  // Insert routes below
  app.use('/api/shortens', require('./api/shorten'));
  app.use('/api/things', require('./api/thing'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });

  app.route('/shorten')
    .post(function(req, res) {
      if ((req.body.link.substring(0, 7) === "http://") || (req.body.link.substring(0, 8) === "https://")) {
        addLink(req.body.link);
      } else {
        res.send(addLink('http://'+req.body.link));
      }
    });

  app.route('/:id')
    .get(function(req, res) {
      if (links[req.params.id]) {
        res.redirect(links[req.params.id]);
      } else {
        req.params.id === 'allLinks' ? res.send(links) : res.status(404).send('Sorry, no link stored with given id :(');        
      }
      
    });
};
