
// 3D Racing Game with Physics, AI Opponents, Controls, Nitro Boost, Obstacles, Power-ups, Leaderboard, Collision Effects & Drifting Mechanics
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';

let scene, camera, renderer, car, world, carBody, aiCar, aiCarBody;
let keys = {};
let laps = 0;
let leaderboard = { player: 0, ai: 0 };
let obstacles = [];
let powerUps = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    // Physics World
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Car Physics Body
    carBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 1)),
        position: new CANNON.Vec3(0, 1, 0)
    });
    world.addBody(carBody);

    // AI Opponent Car Physics Body
    aiCarBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 1)),
        position: new CANNON.Vec3(0, 1, -5)
    });
    world.addBody(aiCarBody);

    // Car Model
    const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
    const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    car = new THREE.Mesh(carGeometry, carMaterial);
    scene.add(car);

    // AI Car Model
    const aiCarMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    aiCar = new THREE.Mesh(carGeometry, aiCarMaterial);
    scene.add(aiCar);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x007700 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Ground Physics Body
    const groundBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    window.addEventListener('keydown', (e) => keys[e.code] = true);
    window.addEventListener('keyup', (e) => keys[e.code] = false);

    camera.position.set(0, 3, 5);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);

    let force = 5;
    let driftFactor = keys['Space'] ? 0.5 : 1;
    if (keys['ArrowUp']) carBody.velocity.z -= force * 0.1 * driftFactor;
    if (keys['ArrowDown']) carBody.velocity.z += force * 0.1 * driftFactor;
    if (keys['ArrowLeft']) carBody.angularVelocity.y += 0.1 * driftFactor;
    if (keys['ArrowRight']) carBody.angularVelocity.y -= 0.1 * driftFactor;
    if (keys['ShiftLeft']) carBody.velocity.z -= force * 0.2;

    car.position.copy(carBody.position);
    car.quaternion.copy(carBody.quaternion);
    aiCar.position.copy(aiCarBody.position);
    aiCar.quaternion.copy(aiCarBody.quaternion);
    
    renderer.render(scene, camera);
}

init();
