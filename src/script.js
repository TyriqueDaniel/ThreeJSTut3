import * as dat from 'dat.gui';
import * as THREE from 'three';
import './style.css';

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Textures

const earthTexture = new THREE.TextureLoader().load('./earth_texture.jpg');
const earthNormal = new THREE.TextureLoader().load('./earth_normal.jpg');
const starTexture = new THREE.TextureLoader().load('./diamond_texture.jpg');

// Objects



const geometry = new THREE.SphereGeometry(0.5, 64, 64);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCnt = 5000;

const posArray = new Float32Array(particlesCnt * 3);

for (let i = 0; i < particlesCnt * 3; i++) {
  // posArray[i] = Math.random()
  // posArray[i] = Math.random() - 0.5;
  posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(posArray, 3)
);

// Materials

const material = new THREE.PointsMaterial({
  size: 0.005,
});
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.005,
  map: starTexture,
 
  transparent: true,
});

// Mesh
const sphere = new THREE.Mesh(
  geometry,
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthNormal,
  })
);
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(sphere, particlesMesh);

// gui.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1);
const lightHelper = new THREE.PointLightHelper(pointLight);

pointLight.position.set(5, 5, 5);
scene.add(pointLight, lightHelper);



/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#21282a'), 1);
//Mouse

document.addEventListener('mousemove', animateParticles);

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
  mouseY = event.clientY;

  mouseX = event.clientX;
}

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    
    particlesMesh.rotation.y = -.1 * elapsedTime;

  // Update objects
    sphere.rotation.y = 0.5 * elapsedTime;

    if (mouseX > 0) {
         particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.0008);

         particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.0008);
    }
 


  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
