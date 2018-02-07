// Require index.html so it gets copied to dist
require('./index.html');

var Elm = require('./Main.elm');
var mountNode = document.getElementById('main');

var audioContext = new AudioContext()
var filter = audioContext.createBiquadFilter();
filter.connect(audioContext.destination);
var oscillator = null;

var startOscillator = function(frequency) {
  oscillator && oscillator.stop(0)
  oscillator = audioContext.createOscillator()
  oscillator.type = 'sawtooth'
  oscillator.frequency.value = frequency
  oscillator.connect(filter)
  oscillator.start(0)
}

var stopOscillator = function (frequency) {
  oscillator && oscillator.stop(0)
  oscillator = null;
}

// .embed() can take an optional second argument. This would be an object describing the data we need to start a program, i.e. a userID or some token
var app = Elm.Main.embed(mountNode);

app.ports.playNote.subscribe(function(args) {
  startOscillator(args);
});

app.ports.stopNote.subscribe(function(args) {
  stopOscillator(args)
});
