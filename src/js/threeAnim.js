import * as THREE from "three";
import glvertex from './glsl/vertex.glsl';
import glfragment from './glsl/fragment.glsl';

// EffectComposer is now a part of Three
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';


var camera, scene, renderer, composer, renderPass, customPass;
var geometry, material, mesh, texture, uMouse = new THREE.Vector2(0, 0);

var img = document.getElementById('texture');
img.style.opacity = 0;


texture = new THREE.TextureLoader().load(img.src);

init()
animate();

function init() {

    /*
    ----------------- Camera -----------------
    */
    // 1st -- field of view (in degrees). How far it is, 100 is the closest. 
    // 2nd -- aspect ratio (almost always kept the same)
    // 3rd && 4th are the near and far clipping pane (related to render)
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 10);

    // How far away is the camera
    camera.position.z = 5;

    /*
    ----------------- Scene -----------------
    */
    scene = new THREE.Scene();

    scene.background = texture;

    /*
    ----------------- Renderer -----------------
    */

    let heroBG = document.getElementById('bg')

    let offsetWidth = heroBG.offsetWidth;
    let offsetHeight = heroBG.offsetHeight;

    // Creating renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    // Setting it's size
    renderer.setSize(offsetWidth, offsetHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // Adding renderer to DOM
    heroBG.appendChild(renderer.domElement);

    /*
     ----------------- Geometry -----------------
     */
    // Setting geometry 
    // 1st -- x-axis size 
    // 2nd -- y-axis size 
    geometry = new THREE.PlaneGeometry(window.innerWidth / 135, window.innerHeight / 135, 1, 1);
    material = new THREE.MeshBasicMaterial({
        map: texture
    });
    mesh = new THREE.Mesh(geometry, material);

    // Adding geometry to the scene
    scene.add(mesh);

    // Post processing
    composer = new EffectComposer(renderer);
    renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Creating distortion effect and passing it as a new Shader
    var distortionEffect = {
        uniforms: {
            "tDiffuse": { value: null },
            "resolution": { value: new THREE.Vector2(1, 10 / 5) },
            "uMouse": { value: new THREE.Vector2(-10, -10) },
            "uVelo": { value: 50 },
        },
        vertexShader: glvertex,
        fragmentShader: glfragment
    }

    customPass = new ShaderPass(distortionEffect);
    customPass.renderToScreen = true;
    composer.addPass(customPass);

}

// Assigning mouse values and animating
function animate() {
    customPass.uniforms.uMouse.value = uMouse;
    requestAnimationFrame(animate);

    composer.render()
}

// Setting mouse values on mousemove
document.addEventListener('mousemove', (e) => {

    let heroBG = document.getElementById('bg')

    let bounds = heroBG.getBoundingClientRect();
    let x = e.clientX - bounds.left;
    let y = e.clientY - bounds.top;

    var offsetWidth = heroBG.offsetWidth;
    var offsetHeight = heroBG.offsetHeight;

    uMouse.x = (x / offsetWidth);
    uMouse.y = 1 - (y / offsetHeight);

});