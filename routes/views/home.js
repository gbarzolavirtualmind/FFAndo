var async = require('async');
var keystone = require('keystone');
var Home = keystone.list('Home');

exports = module.exports = function(req, res) {
	
	var locals = res.locals,
  view = new keystone.View(req, res);

  locals.formData = req.body || {};
  locals.validationErrors = {};
  locals.enquirySubmitted = false;	

	// Set locals
	locals.section = 'home';
  locals.data = {
    lastHashtags: [],
    outstandingVideos: [],
    lastVideos: []
  };


  view.on('init', function(next) {

    async.series([

      function(cb) {
        var q = keystone.list('Video').model.find().limit('3');
        q.exec(function(err, results) {
          locals.data.outstandingVideos = results;
          return cb(err);
        });

      },
      
      function(cb) {
        var q = keystone.list('Video').model.find().limit('20');
        q.exec(function(err, results) {
          locals.data.lastVideos = results;
          return cb(err);
        });
      },
      
      function(cb) {
        var q = keystone.list('Video').model.find().limit('10');
        q.exec(function(err, results) {
          locals.data.lastHashtags = results;
          return cb(err);
        });    
      }
    ],function(err){
        return next(err);
      });
  });

  view.on('post', { action: 'contact' }, function(next) {          
   var model = new Home.model(),
   updater = model.getUpdateHandler(req);

   updater.process(req.body, {
     flashErrors: true,
             //fields: 'name, email, phone, enquiryType, message',
             errorMessage: 'There was a problem submitting your enquiry:'
           }, function(err) {
             if (err) {
               locals.validationErrors = err.errors;
             } else {
               locals.enquirySubmitted = true;
             }
             next();
           });      
 });

	// Render the view
	view.render('home');
	
}