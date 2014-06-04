var keystone = require('keystone');
var Upload = keystone.list('Upload');
 
exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res);

	locals.formData = req.body || {};
    locals.validationErrors = {};
    locals.enquirySubmitted = false;	
	
	// Set locals
	locals.section = 'upload';
  locals.data = {
    lastHashtags: [],
    moreUsedHashtags: [],
    outstandingVideos: [],
    lastVideos: []
  };
  
	

view.on('post', { action: 'contact' }, function(next) {
               
   var model = new Upload.model(),
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
	view.render('upload');
	
}