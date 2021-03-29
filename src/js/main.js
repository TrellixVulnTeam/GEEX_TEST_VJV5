import $ from 'jquery';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import * as THREE from 'three';
// import './blotter.js'
// import './blotterMaterial.js'
import '../scss/main.scss';
import '../index.html';

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin);

let worksSlides = document.getElementById("worksSlides");

gsap.to(worksSlides, {
    x: () => -(worksSlides.scrollWidth - document.documentElement.clientWidth) + "px",
    ease: "none",
    scrollTrigger: {
        trigger: worksSlides,
        invalidateOnRefresh: true,
        pin: true,
        scrub: 1,
        end: () => "+=" + worksSlides.offsetWidth
    }
})

let createDigital = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        scrub: true
    }
})

createDigital.to(".hero-wrapper", {
    transform: "translateY(60vw)"
})


var rotate = gsap.timeline({
    scrollTrigger: {
        trigger: ".showreel-wrapper__title",
        // pin: true,
        scrub: true,
        start: 'top bottom',
        end: '+=10000',
    }
})
rotate.to(".showreel-wrapper__title-container--circle", {
    rotation: -360 * 1,
    ease: 'none'
})



function srSec() {
    gsap.to(window, { duration: 1, scrollTo: { y: ".showreel-wrapper__content-sr", offsetY: 0 } });
}
function heroSec() {
    gsap.to(window, { duration: 1, scrollTo: { y: ".header", offsetY: 0 } });
}

var toSec = gsap.timeline({
    scrollTrigger: {
        trigger: ".showreel",
        start: 'top bottom',
        onEnter: () => srSec(),
        onLeaveBack: () => heroSec()
    }
})




// var text = new window.Blotter.Text("Bro", {
//     family: 'Montserrat',
//     size: 300,
//     fill: "#000",
//     paddingLeft: 80,
//     paddingRight: 80,
//     paddingTop: 80,
//     paddingBottom: 80,
// })

// var material = new window.Blotter.LiquidDistortMaterial();


// var blotter = new window.Blotter(material, {
//     texts: text
// })

// var scope = blotter.forText(text);

// scope.appendTo(document.body);
// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// camera.position.z = 5;

// var animate = function () {
//     requestAnimationFrame(animate);

//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;

//     renderer.render(scene, camera);
// };

// animate();

// let TEXTURE = new TextureLoader().load('supaAmazingImage.jpg');
// let mesh = new Mesh(
//     new PlaneBufferGeometry(),
//     new MeshBasicMaterial({ map: TEXTURE })
// )

let fontSize = $(window).width() * 0.2

// $(window).on('resize', function () {
//     let fontSize = $(window).width() * 0.2
//     console.log(fontSize);

//     return fontSize
// })

var text1 = new Blotter.Text("Create", {
    family: 'LuciferSansRegular',
    size: fontSize,
    fill: "#FFDA13"
})
var text2 = new Blotter.Text("Digital", {
    family: 'LuciferSansRegular',
    size: fontSize,
    fill: "#FFDA13"
})

var material = new Blotter.LiquidDistortMaterial();
material.uniforms.uVolatility.value = 0.05;
material.uniforms.uSeed.value = 0;
material.uniforms.uSpeed.value = 0.4;


var blotter = new Blotter(material, {
    texts: [text1, text2]
})

let heroTxt1 = document.getElementById('heroTxt1')
let heroTxt2 = document.getElementById('heroTxt2')

var scope = blotter.forText(text1);

scope.appendTo(heroTxt1);

// document.onmousemove = moveIt;
// function moveIt(event) {

//     material.uniforms.uRotation.value = (event.clientX * .1);
//     material.uniforms.uOffset.value = (event.clientX * .0001);

// }