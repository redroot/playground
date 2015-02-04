/** @jsx React.DOM */

var React = require('react');
var Tweet = require('./Tweet.react');

var TweetsList = React.createClass({
	render: function() {
		var content = this.props.tweets.map(function(tweet){
			return (
				<Tweet key={tweet.twid} tweet={tweet} />
			);
		});

		return (
			<ul className='tweets'>{content}</ul>
		);
	}
});

module.exports = TweetsList;