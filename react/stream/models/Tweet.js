var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    twid       : String
  , active     : Boolean
  , author     : String
  , avatar     : String
  , body       : String
  , date       : Date
  , screenname : String
});

var per_page = 10;

// create static method to return tweet data from db
schema.statics.getTweets = function(page, skip, callback) {

	var tweets = [],
			start  = (page * per_page) + (skip * 1);

	Tweet.find(
					{}, 
					'twid active author avatar body date screenname', 
					{skip: start, limit: per_page}
				)
			 .sort({date: 'desc'})
			 .exec(function(err,docs){
			 		if(!err){
			 			tweets = docs;
			 			tweets.forEach(function(tweet){
			 				tweet.active = true;
			 			});
			 		}
			 		callback(tweets);
			 });
}

// Return a Tweet model based upon the defined schema
module.exports = Tweet = mongoose.model('Tweet', schema);