var express  = require('express'),
		exphbs   = require('express-handlebars'),
		http     = require('http'),
		io       = require('socket.io'),
		mongoose = require('mongoose'),
		ntwitter = require('ntwitter'),
		routes   = require('./routes'),
		config   = require('./config'),
		streamHandler = require('./utils/streamHandler');

// create express instance and port variable
var app  = express();
var port = process.env.PORT || 8080;

// set up the app
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine','handlebars');
app.disable('etag');

//db connection
mongoose.connect('mongodb://localhost/react-tweets');

// twitter connection
var twit = new ntwitter(config.twitter);

// routes for expires
app.get('/', routes.index);
app.get('/page/:page/:skip', routes.page);
// public assets folder
app.use('/', express.static(__dirname + "/public/"));

// start servers
var server = http.createServer(app).listen(port, function(){
	console.log("Express Listening on Port" + port);
});
var io_server = io.listen(server);

// finally setup streamHandler
twit.stream('statuses/filter', { track: 'netball, #netball' }, function(stream){
	streamHandler(stream,io_server);
});
