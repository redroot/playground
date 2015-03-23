'use strict';

var _ = require('underscore');

var to_run = {
	'one': function(date){
		return setTimeout(function(){
			console.log("Im number one!", date);
		},100);
	},
	'two': function(date){
		return setTimeout(function(){
			console.log("Im number two!", date);
		},50);
	},
	'three': function(date){
		return setTimeout(function(){
			console.log("Im number three!", date);
		},200);
	},
	'four': function(date){
		return setTimeout(function(){
			console.log("Im number four!", date);
		},0);
	},
}

var date = '2015-03-15'

_(_.keys(to_run)).each(function(key){
	to_run[key]();
});
