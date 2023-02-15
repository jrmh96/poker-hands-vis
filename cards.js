// Jeremy Hu
// 02/2023
// A little personal visualization of the space of poker starting hands

// Future ideas: given a hand range, highlight combinations in that range

'use strict'
// https://stackoverflow.com/questions/60155446/cube-of-cubes-in-three-js

function createHandMatrix(ranks) {
  // Create 2-D grid with offsuit, paired, and suited hands 

  const data = Array();
  // Really dumb way of pre-allocating - fix this later
  for(let i = 0; i < ranks.length; i++){
    data[i]=[];
    for(let j = 0; j < ranks.length; j++) {
      data[i][j] = [];
    }
  }

  for(let i = 0; i < ranks.length; i++) {
    for(let j = i; j < ranks.length; j++) {
      if (i != j) {
        data[i][j] = [ranks[i]+ranks[j], "s"]; // suited hands go along row i
        data[j][i] = [ranks[i]+ranks[j], "o"]; // off suit hands go along col. i
      } else {
        data[i][j] = [ranks[i]+ranks[j], "pair"];
      }
    }
  }
  return data;
}

function createCubeGrid(suits, hands, gridGap) {
  // Input nxnx2 list of hands
  // constructed with createHandMatrix()

  let cubes = [];
  let offsuit = [];
  let suited = [];
  let pairs = [];
  for (let s1 in suits) {
    for (let s2 in suits) {
      if (s1 == s2) {
        suited.push(s1+s2);
      } else {
        offsuit.push(s1+s2);
        if (!pairs.includes(s2+s1) && !pairs.includes(s1+s2)) {
          pairs.push(s1+s2);
        }
      }
    }
  }

  let offSuitMaterial = new THREE.MeshBasicMaterial({ color: "skyblue", opacity: 0.2, transparent: true });
  let suitedMaterial = new THREE.MeshBasicMaterial({ color: "red" });
  let pairMaterial = new THREE.MeshBasicMaterial({color: "darkorchid"});

  for(let i = 0; i < hands.length; i++) {
    for(let j = 0; j < hands[0].length; j++) {
      let handType = hands[i][j][1];

      if (handType == "o") {
        console.log("Here");
        for (let k = 0; k < offsuit.length; k++) {
          let cube = new THREE.Mesh(geometry, offSuitMaterial);
          // Construct cube location
          cube.position.x += i * gridGap;
          cube.position.z += j * gridGap;
          cube.position.y += k * gridGap;

          // Add scene to cube
          scene.add(cube);
        }
      } else if(handType == "s") {
        console.log("Here2");
        for (let k = 0; k < suited.length; k++) {
          let cube = new THREE.Mesh(geometry, suitedMaterial);
          // Construct cube location
          cube.position.x += i * gridGap;
          cube.position.z += j * gridGap;
          cube.position.y += k * gridGap;

          // Add scene to cube
          scene.add(cube);
        }
      } else {
        console.log("Here3");
        for (let k = 0; k < pairs.length; k++) {
          let cube = new THREE.Mesh(geometry, pairMaterial);
          // Construct cube location
          cube.position.x += i * gridGap;
          cube.position.z += j * gridGap;
          cube.position.y += k * gridGap;

          // Add scene to cube
          scene.add(cube);
        }
      }
    }
  }
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
// let material = new THREE.MeshLambertMaterial({ color: 0x1928d7, opacity: 0.2, transparent: true }); //material that colors the box
  
///////////////////////////////////////////////////////

let gridWidth = 5;
let gridGap = 3;

let suits = ["s", "c", "h", "d"];
let ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

let hands = createHandMatrix(ranks);
console.log(hands);

createCubeGrid(suits, hands, gridGap);

camera.position.x = -40;
camera.position.y = 35;
camera.position.z = -20;
let axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

///////////////////////////////////////////////////////

//render loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
animate();



