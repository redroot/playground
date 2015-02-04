var JSX       = require('node-jsx').install(),
		React     = require('react'),
		TweetsApp = require('./components/TweetsApp.react'),
		Tweet     = require('./models/Tweet');

module.exports = {

	// main page markup
	index: function(req, res){

		Tweet.getTweets(0,0,function(tweets){
			// render react to a string so we can send it to the page
			var markup = React.renderComponentToString(
				TweetsApp({
					tweets: tweets
				})
			);

			res.render('home',{
				markup: markup,
				state: JSON.stringify(tweets) // pass the latest state, can we do this directly into TweetsApp?!
			});

		});
	},

	page: function(req, res){
		Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
			res.send(tweets); // send a json
		});
	}

};