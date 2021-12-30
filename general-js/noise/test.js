const {SimplexNoise} = require('simplex-noise');

const simplex = new SimplexNoise();
const y = simplex.noise2D(2,20) * 10;

console.log(y);