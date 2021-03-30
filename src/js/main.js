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
        trigger: ".hero-wrapper",
        start: "top-=80 top",
        scrub: true,
        // pin: true,
        // markers: true
    }
})

createDigital.to(".hero-wrapper", {
    y: "10vw",
    // ease: "power1.inOut"
})


/*------------------------------------------------------------------------------------------------------------------*/
/*	Madness Rotation on Scroll
--------------------------------------------------------------------------------------------------------------------*/

var rotate = gsap.timeline({
    scrollTrigger: {
        trigger: ".showreel-wrapper__title",
        start: 'top bottom',
        scrub: true,
    }
})
rotate.from("#textIT", {
    attr: { startOffset: "70%" },
    duration: 15,
    ease: 'none'
})


/*------------------------------------------------------------------------------------------------------------------*/
/*	Scroll to Showreel 
--------------------------------------------------------------------------------------------------------------------*/

function srSec() {
    // console.log('yeees');
    gsap.set("body", { overflowX: "hidden", overflowY: "hidden" });
    gsap.to(window, {
        duration: 1,
        scrollTo: { y: ".showreel-wrapper__content-sr", autoKill: false },
        overwrite: true,
        onComplete: () => gsap.set("body", { overflowX: "hidden", overflowY: "auto" })
    });
}
// function heroSec() {
//     gsap.to(window, { duration: 1, scrollTo: { y: ".header", offsetY: 0 } });
// }

ScrollTrigger.create({
    trigger: ".showreel-wrapper__content-sr",
    start: 'top bottom-=100',
    onEnter: () => srSec(),
})

/*------------------------------------------------------------------------------------------------------------------*/
/*	Blotter text animation
--------------------------------------------------------------------------------------------------------------------*/

let fontSize = $(window).width() * 0.2

// $(window).on('resize', function () {
//     let fontSize = $(window).width() * 0.2
//     console.log(fontSize);

//     return fontSize
// })

var text1 = new Blotter.Text("CREATE", {
    family: 'Lucifer Sans SemiExp Light',
    size: fontSize,
    leading: 1.3,
    weight: 300,
    fill: "#FFDA13"
})
var text2 = new Blotter.Text("DIGITAL", {
    family: 'Lucifer Sans SemiExp Light',
    size: fontSize,
    leading: 1.3,
    weight: 300,
    fill: "#FFDA13"
})

var material = new Blotter.LiquidDistortMaterial();
material.uniforms.uVolatility.value = 0.03;
material.uniforms.uSeed.value = 0.1;
material.uniforms.uSpeed.value = 0.3;


var blotter = new Blotter(material, {
    texts: [text1, text2]
})

let heroTxt1 = document.getElementById('heroTxt1')
let heroTxt2 = document.getElementById('heroTxt2')

var scope = blotter.forText(text1);
var scope2 = blotter.forText(text2);

scope.appendTo(heroTxt1);
scope2.appendTo(heroTxt2);

// document.onmousemove = moveIt;
// function moveIt(event) {

//     material.uniforms.uRotation.value = (event.clientX * .1);
//     material.uniforms.uOffset.value = (event.clientX * .0001);

// }





const image = document.getElementsByClassName('showreel-wrapper__content-sr--play')
// const cursor = document.getElementById("cursor");

$('.showreel-wrapper__content-sr').on('mouseenter', function (e) {
    // gsap.to(cursor, 0.1, { autoAlpha: 0 })
    gsap.to(image, 0.1, { autoAlpha: 1 })

    // console.log('here');

    var clientX = e.pageX - $(this).offset().left;
    var clientY = e.pageY - $(this).offset().top;


    console.log(clientX, clientY);

    const render = () => {
        gsap.set(image, {
            left: clientX,
            top: clientY
        });
        // requestAnimationFrame(render);
    };
    render();
})

$('.showreel-wrapper__content-sr').on('mouseleave', function (e) {
    // gsap.to(cursor, 0.1, { autoAlpha: 1 })
    gsap.to(image, 0.1, { autoAlpha: 0 })
    console.log('out');

})

$('.showreel-wrapper__content-sr').on('mousemove', function (e) {
    // var clientX = e.pageX;
    // var clientY = e.pageY;

    var clientX = e.pageX - $(this).offset().left;
    var clientY = e.pageY - $(this).offset().top;

    const render = () => {
        gsap.set(image, {
            left: clientX,
            top: clientY,
        });
        // requestAnimationFrame(render);
    };
    render();
})