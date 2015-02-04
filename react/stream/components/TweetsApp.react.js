/** @jsx React.DOM */

var React = require('react');
var Loader = require('./Loader.react');
var TweetsList = require('./TweetsList.react');
var NotificationBar = require('./NotificationBar.react');

var TweetsApp = React.createClass({
	addTweet: function(tweet){
		// adding unread tweets
    var updated = this.state.tweets,
    		count   = this.state.count + 1,
    		skip    = this.state.skip + 1;
    updated.unshift(tweet);
    this.setState({tweets: updated, count: count, skip: skip});
	},
	showNewTweets: function(){
    var updated = this.state.tweets;
    updated.forEach(function(tweet){
      tweet.active = true;
    });
    this.setState({tweets: updated, count: 0});
	},
	checkWindowScroll: function(){
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var s = document.body.scrollTop;
    var scrolled = (h + s) > document.body.offsetHeight;
    if(scrolled && !this.state.paging && !this.state.done) {
      this.setState({paging: true, page: this.state.page + 1});
      this.getPage(this.state.page);
    }
	},
	getPage: function(page) {
		var request = new XMLHttpRequest();
    request.open('GET', 'page/' + page + "/" + this.state.skip, true);
    request.onload = function() {
    	if(request.status >= 200 && request.status < 400){
    		this.loadPagedTweets(JSON.parse(request.responseText));
    	}else{
    		this.setState({paging: false, done: true});
    	}
    }.bind(this);
    request.send();
	},
	loadPagedTweets: function(newTweets){
		if(newTweets.length > 0){
			var updated = this.state.tweets;
			newTweets.forEach(function(tweet){
        updated.push(tweet);
      });
			setTimeout(function(){
				this.setState({tweets: updated, paging: false});
			}.bind(this), 1000); // timeout for dramatic effect
		}else{
			this.setState({paging: false, done: true});
		}
	},
	getInitialState: function(props){
		props = props || this.props;

		// setting state via prop sis considered an anti pattern
		// in the case we need to do to make it remounts correclty
		// as it takes setting from the server
		return {
			tweets: props.tweets,
			count: 0, // how many unread
			page: 0, // what page are we up to
			paging: false, // are we fetching a new page
			skip: 0, // how many to skip when fetching the page
			done: 0 // anything left
		};
	},
	// use the below method to make sure if the component is
	// re mounted it gets up to date props
	componentWillReceiveProps: function(newProps,oldProps){
		this.setState(this.getInitialState(newProps));
	},
	componentDidMount: function(){
		var socket = io.connect(); // connect to socket io ... dependency assumed here?
		socket.on('tweet',function(data){
			this.addTweet(data)
		}.bind(this));
		window.addEventListener('scroll', this.checkWindowScroll); // for infinite scrolling
	},
	render: function() {
		return (
			<div className="tweets-app">
				<TweetsList tweets={this.state.tweets} />
				<Loader paging={this.state.paging} />
				<NotificationBar count={this.state.count} onShowNewTweets={this.showNewTweets} />
			</div>	
		);
	}
});

module.exports = TweetsApp;