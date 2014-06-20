var needle = require('needle');
var cheerio = require('cheerio');
var request = require('request');
var _ = require('underscore');
var keystone = require('keystone');
var async = require('async');
var Video = keystone.list('Video');


exports = module.exports = function(req, res) {
	
	var locals = res.locals,
  view = new keystone.View(req, res);

  locals.formData = req.body || {};
  locals.validationErrors = {};
  locals.enquirySubmitted = false;	

	// Set locals
	locals.section = 'video';
  locals.data = {
    urlVideo: [],
    videoSelected: [],
    username: [],
    tagsNames: [],
    relatedVideos: []
  };


  view.on('init', function(next) {
    async.series([
      function(cb) {
        var q = keystone.list('Video').model.find().where('_id', req.params.id);
        q.exec(function(err, results) {
          locals.data.videoSelected = results[0];        
          return cb(err);
        });
      },

      function(cb) {
        var tagsNames = [];
        var a = locals.data.videoSelected.tags;
        var i = 0;
        a.forEach(function(a) {
            var q = keystone.list('Tag').model.find().where('_id', a);
            q.exec(function(err, results) {
              tagsNames[i] = results[0];
              i++;
              //TODO: PREGUNTAR A BETO LA GILADA DEL ARRAY!!!
            });  
        });
        locals.data.tagsNames = tagsNames
        return cb()
      },

      function(cb) {
        var q = keystone.list('User').model.find().where('_id', locals.data.videoSelected.user);
        q.exec(function(err, results) {
          locals.data.username = results[0];
          //TODO: Poner el username en un valor de videoSelected
          return cb(err);
        });
      },

      function(cb) {
        var q = keystone.list('Video').model.find({'_id': {$ne : req.params.id}})
                                                   .limit('4')
                                                   .where('tags').in(locals.data.videoSelected.tags);
        q.exec(function(err, results) {
          console.log(results);
          locals.data.relatedVideos = results;

          return cb(err);
        });
      }

    ],function(err){
        return next(err);
      });
  });

  view.on('init', function(next) {
    var form = {
      op:"login",
      redirect:"",
      login:"Reco-X",
      password:"35322114"
    };

    var url = "http://uptobox.com/"+locals.data.videoSelected.urlUptobox;
    //console.log(url)
    var j = request.jar();
    var cookie1 =  request.cookie("login=Reco-X")
    var cookie2 = request.cookie("xfss=65b6ozipt2og60x4")
    j.setCookie(cookie1, "http://uptobox.com");
    j.setCookie(cookie2, "http://uptobox.com");

    request({uri:url, jar:j},function(error,response,body){
      var $ = cheerio.load(body);
      var hiddens = $("input[type='hidden']");  
      var getHiddenValue = function(hiddens,name){
        result = _.find(hiddens,function(item){return item.attribs.name==name});
        if (result) {
          return result.attribs.value;
        }
        return false
      }
      var form2 = {
        op:getHiddenValue(hiddens,"op"),
        id:getHiddenValue(hiddens,"id"),
        rand:getHiddenValue(hiddens,"rand"),
        referer:getHiddenValue(hiddens,"referer"),
        method_free:"",
        method_premium:1  
      };
      request.post(url,{form:form2,jar:j},function(error,response,body){
        var $ = cheerio.load(body);
        var video_url = $(".button_upload a").attr("href");
        locals.data.urlVideo = video_url;
        next()
      });
    });
  });


	// Render the view
	view.render('video');
	
}