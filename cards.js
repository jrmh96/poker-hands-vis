'use strict'
// https://stackoverflow.com/questions/60155446/cube-of-cubes-in-three-js
function lineOfMeshes(w, g) {
  let cubes = [];

  for (let i = 0; i < w; i++) {
    cubes.push(new THREE.Mesh(geometry, material));
    cubes[i].position.x += i * g;
  }
  //console.log("LINE:" + cubes);
  return cubes;
}
  
function gridOfMeshes(w, g) {
  let cubes = [];
  for (let line = 0; line < w; line++) {
    cubes.push(lineOfMeshes(w, g));
    for (let cube = 0; cube < w; cube++) {
      cubes[line][cube].position.z += line * g;
    }
  }
  //console.log("GRID: " + cubes);
  return cubes;
}
  
function cubeOfMeshes(w, g) {
  let cubes = [];

  for (let grid = 0; grid < w; grid++) {
    cubes.push(gridOfMeshes(w, g));
    for (let line=0;line<w;line++) {
      for (let cube = 0; cube < w; cube++) {
        cubes[grid][line][cube].position.z += line * g;
      }
    }

  }
  //console.log("CUBE"+ cubes);
  return cubes;
}
  
let scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
  
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;
let geometry = new THREE.BoxGeometry(); //object that contains all the points and faces of the cube
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); //material that colors the box
//let cube = new THREE.Mesh(geometry, material); //a mesh is an object that takes a geometry and applies a material to it
  
///////////////////////////////////////////////////////

let gridWidth = 5;
let gridGap = 3;

let cubes = cubeOfMeshes(gridWidth, gridGap);

cubes.forEach(grid => {
  grid.forEach(line => {
    line.forEach(cube=>{
      scene.add(cube);
    })
  });
});

camera.position.z = 5;

///////////////////////////////////////////////////////

//render loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
animate();


