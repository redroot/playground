// Require index.html so it gets copied to dist
require('./index.html');

var Elm = require('./Main.elm');
var mountNode = document.getElementById('main');

var audioContext = new AudioContext()
var filter = audioContext.createBiquadFilter();
filter.connect(audioContext.destination);
var oscillators = {};

var freqToKey = function(frequency) {
  return frequency.toString();
}

var startOscillator = function(frequency) {
  var key = freqToKey(frequency);
  if (oscillators[key]) { return true; }
  oscillators[key] = audioContext.createOscillator()
  oscillators[key].type = 'sawtooth';
  oscillators[key].frequency.value = frequency;
  oscillators[key].connect(filter);
  oscillators[key].start(0);
}

var stopOscillator = function (frequency) {
  var key = freqToKey(frequency);
  oscillators[key] && oscillators[key].stop(0)
  oscillators[key] = null;
}

// .embed() can take an optional second argument. This would be an object describing the data we need to start a program, i.e. a userID or some token
var app = Elm.Main.embed(mountNode);

app.ports.playNote.subscribe(function(args) {
  startOscillator(args);
});

app.ports.stopNote.subscribe(function(args) {
  stopOscillator(args)
});
