'use strict';

var _ = require('underscore');
var Q = require('q');

var to_run = {
	'one': function(date){
		var deferred = Q.defer();
		setTimeout(function(){
			console.log("Im number one!", date);
			deferred.resolve(date);
		},100);
		return deferred.promise;
	},
	'two': function(date){
		var deferred = Q.defer();
		setTimeout(function(){
			console.log("Im number two!", date);
			deferred.resolve(date);
		},50);
		return deferred.promise;
	},
	'three': function(date){
		var deferred = Q.defer();
		setTimeout(function(){
			console.log("Im number three!", date);
			deferred.resolve(date);
		},200);
		return deferred.promise;
	},
	'four': function(date){
		var deferred = Q.defer();
		setTimeout(function(){
			console.log("Im number four!", date);
			deferred.resolve(date);
		},0);
		return deferred.promise;
	},
}

var result = Q('2015-03-05');

_(_.keys(to_run)).each(function(key){
	result = result.then(to_run[key]);
});
