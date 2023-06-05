// Jeremy Hu
// 02/2023
// A little personal visualization of the space of poker starting combos

// Future ideas: Snowglobe effect for individual cubes

// react-icons is installed already

'use strict'
// https://stackoverflow.com/questions/60155446/cube-of-cubes-in-three-js

// Create data representing hands with no suits (only ranks)
// e.g. data[0][0] = ["AA", PAIR_STRING]

let SUITED_STRING = "suited";
let OFFSUIT_STRING = "offsuit";
let PAIR_STRING = "pair";

function createHandMatrix() {
  // Create 2-D grid with offsuit, paired, and suited hands 
  let ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
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
        data[i][j] = [ranks[i]+ranks[j], SUITED_STRING]; // suited hands go along row i
        data[j][i] = [ranks[i]+ranks[j], OFFSUIT_STRING]; // off suit hands go along col. i
      } else {
        data[i][j] = [ranks[i]+ranks[j], PAIR_STRING];
      }
    }
  }
  return data;
}

// Create cube visuals
function createCubeGrid(hands, gridGap) {
  // Input nxnx2 list of hands constructed with createHandMatrix()
  // [["AA", PAIR_STRING], ...]
  let suits = ["s", "c", "h", "d"];
  let cubes = [];
  let offsuit = [];
  let suited = [];
  let pairs = [];

  // Create combinations of suits
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      
      let s1 = suits[i];
      let s2 = suits[j];
      
      if (i == j) {
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
  let suitedMaterial = new THREE.MeshBasicMaterial({ color: "pink", opacity: 0.2, transparent: true });
  let pairMaterial = new THREE.MeshBasicMaterial({ color: "darkorchid", opacity: 0.2, transparent: true });

  for(let i = 0; i < hands.length; i++) {
    for(let j = 0; j < hands[0].length; j++) {
      let handType = hands[i][j][1];

      let suit_array = handType == OFFSUIT_STRING ? offsuit : handType == SUITED_STRING ? suited : pairs;
      let material = handType == OFFSUIT_STRING ? offSuitMaterial : handType == SUITED_STRING ? suitedMaterial : pairMaterial; 
      
      for (let k = 0; k < suit_array.length; k++) {
        let cube = new THREE.Mesh(geometry, material);
        // Construct cube location
        cube.position.x += i * gridGap;
        cube.position.z += j * gridGap;
        cube.position.y += k * gridGap;
        cube.name = hands[i][j][0] + suit_array[k]; // UID: card,card,suit,suit e.g. AAsc
        scene.add(cube);
      }
    }
  }

  return cubes;
}

// Show selected hand by maxing out opacity
function selectHand(hand) {

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
let cardGridElement = document.getElementById("cardGrid");
let s = getComputedStyle(cardGridElement);

renderer.setSize(parseInt(s.width), parseInt(s.height));

cardGridElement.appendChild(renderer.domElement);


let controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;
let geometry = new THREE.BoxGeometry(); //object that contains all the points and faces of the cube
  
///////////////////////////////////////////////////////

let gridWidth = 5;
let gridGap = 3;

let hands = createHandMatrix();

createCubeGrid(hands, gridGap);

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



///////////////////////////////////////////////////////



