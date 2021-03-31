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

// Creating dummy element
let dummyimg = document.createElement("img");
// After dummy element is loaded
dummyimg.onload = function () {

    img.style.opacity = 0;

    // Setting a texture
    texture = new THREE.Texture(this);
    texture.needsUpdate = true;

    init()
    animate();
}
// Source of a dummy image is now same as html image
dummyimg.src = img.src;

function init() {

    // To actually be able to display anything with three.js, we need three things: scene, camera and renderer

    console.log(texture);

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

    /*
    ----------------- Renderer -----------------
    */


    var offsetWidth = document.getElementById('here').offsetWidth;
    var offsetHeight = document.getElementById('here').offsetHeight;

    // Creating renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    // Setting it's size
    renderer.setSize(offsetWidth, offsetHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // Adding renderer to DOM
    document.getElementById('here').appendChild(renderer.domElement);

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



    // post processing
    composer = new EffectComposer(renderer);
    renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    var myEffect = {
        uniforms: {
            "tDiffuse": { value: null },
            "resolution": { value: new THREE.Vector2(1, 10 / 5) },
            "uMouse": { value: new THREE.Vector2(-10, -10) },
            "uVelo": { value: 50 },
        },
        vertexShader: glvertex,
        fragmentShader: glfragment
    }

    customPass = new ShaderPass(myEffect);
    customPass.renderToScreen = true;
    composer.addPass(customPass);

}

function animate() {
    customPass.uniforms.uMouse.value = uMouse;
    requestAnimationFrame(animate);

    // renderer.render( scene, camera );
    composer.render()
}


document.addEventListener('mousemove', (e) => {
    // mousemove / touchmove

    let bounds = document.getElementById('here').getBoundingClientRect();
    let x = e.clientX - bounds.left;
    let y = e.clientY - bounds.top;

    // console.log(x, y);

    var offsetWidth = document.getElementById('here').offsetWidth;
    var offsetHeight = document.getElementById('here').offsetHeight;

    uMouse.x = (x / offsetWidth);
    uMouse.y = 1 - (y / offsetHeight);

    // console.log(uMouse.x, uMouse.y);
});