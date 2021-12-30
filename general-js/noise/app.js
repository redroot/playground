// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
const d = 15;
const camera = new THREE.OrthographicCamera(-d, d, d, -d, 1, 1000);
camera.position.set(d, d, d);
camera.rotation.order = 'YXZ';
camera.rotation.y = -Math.PI / 4;
camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
camera.lookAt(new THREE.Vector3(0, 0, 0));


// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

var geo = new THREE.PlaneBufferGeometry(15,15,30,30);
var mat = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, flatShading: true });
var plane = new THREE.Mesh(geo, mat);

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
const light2 = new THREE.PointLight( 0xff0000, 1, 100 );

light2.position.set( 10, 10, 10 );
scene.add( light );
scene.add( light2 );

scene.add(plane);


const simplex = new SimplexNoise();


const noise2D = (x, y, z, frequency, amplitude) => {
  return simplex.noise2D(x * frequency, y * frequency) * amplitude;
}

const noise3D = (x, y, z, frequency, amplitude) => {
  return (
    simplex.noise3D(x * frequency, y * frequency, z * frequency) * amplitude
  );
}


const updatePlane = (t) => {
  const rawPositions = plane.geometry.attributes.position.array;
  const l = rawPositions.length;

  for (let i = 0; i < l; i += 3) {
    let x = rawPositions[i];
    let y = rawPositions[i + 1];
    let z = rawPositions[i + 2];

    z = noise3D(x, y, t, 1, 3);

    plane.geometry.attributes.position.set([x, y, z], i);
  }

  plane.geometry.attributes.position.needsUpdate = true;

}


let start = 0;
console.log(plane);
// Render Loop
var render = function () {
  start += 0.05;
  requestAnimationFrame( render );
  // Render the scene
  updatePlane(start);

  renderer.render(scene, camera);
};


render();