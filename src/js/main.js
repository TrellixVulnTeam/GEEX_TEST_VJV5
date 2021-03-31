import $ from 'jquery';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import * as THREE from 'three';
import imagesLoaded from "imagesLoaded";

import '../scss/main.scss';
import '../index.html';
// import './threeAnim.js'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin);


// magic functions that are used to calculate style values
const MathUtils = {
    // map number x from range [a, b] to [c, d]
    map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
    // linear interpolation
    lerp: (a, b, n) => (1 - n) * a + n * b
};

// body element
const body = document.body;

// calculate the viewport size
let winsize;
const calcWinsize = () => {
    winsize = {
        width: window.innerWidth,
        height: window.innerHeight
    }
}
calcWinsize();
// and recalculate on resize
window.addEventListener("resize", calcWinsize);

// Really important for window to go back to top
// Otherwise the will be a "jump on reload"
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// getting scroll top position 
let topScroll;
const getTopScroll = () => {
    topScroll = window.pageYOffset || document.documentElement.scrollTop;
}

// updating scroll top position on scroll
window.addEventListener("scroll", getTopScroll);

// SmoothScroll
class SmoothScroll {
    constructor() {
        // this.shouldAnimate = false;

        // get main 
        this.DOM = {
            main: document.querySelector("main")
        };

        // get scrollable div (the one which is being translated)
        this.DOM.scrollable = this.DOM.main.querySelector("div[data-scroll]");

        // this.listenMouse()

        // specifying properties that will change on scroll (y-axis)
        // interpolation between the previous and current value to achieve the smooth scrolling effect
        this.scrlStyles = {
            translationY: {
                // interpolated value
                previous: 0,
                // current value
                current: 0,
                // amount of easing
                ease: 0.1,
                // current value setter
                // in this case the value of the translation will be the same like the document scroll
                setValue: () => topScroll
            }
        };
        // set the body's height
        this.bodySize();
        // set the initial style values
        this.update();
        // modyfy style of the <main> element
        this.mainStyles();
        // on resize reset body height
        this.bodyResize();
        // render loop
        requestAnimationFrame(() => this.render());
    }

    // listenMouse() {
    //     document.addEventListener('mousemove', () => {
    //         this.shouldAnimate = true;
    //     })
    // }


    update() {
        // sets the initial value (no interpolation) - translate the scroll value
        for (const key in this.scrlStyles) {
            this.scrlStyles[key].current = this.scrlStyles[
                key
            ].previous = this.scrlStyles[key].setValue();
        }
        // translate the scrollable div
        this.setPosition();
        // this.shouldAnimate = true;
    }

    setPosition() {
        // if current scroll value is different from previous -- translate 
        if (
            Math.round(this.scrlStyles.translationY.previous) !==
            Math.round(this.scrlStyles.translationY.current) ||
            this.scrlStyles.translationY.previous < 10
        ) {
            // this.shouldAnimate = true;
            this.DOM.scrollable.style.transform = `translate3d(0,${-1 * this.scrlStyles.translationY.previous}px,0)`;
        }
    }

    bodySize() {
        // setting the body height (this will keep the scrollbar on the page)
        body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
    }

    mainStyles() {
        // <main> has to be "sticked" to the screen and not scroll (setting it to position fixed and overflow hidden)
        this.DOM.main.style.position = "fixed";
        this.DOM.main.style.width = this.DOM.main.style.height = "100%";
        this.DOM.main.style.top = this.DOM.main.style.left = 0;
        this.DOM.main.style.overflow = "hidden";
    }

    bodyResize() {
        window.addEventListener("resize", () => this.bodySize());
    }

    render() {
        // update current and interpolated values
        for (const key in this.scrlStyles) {
            this.scrlStyles[key].current = this.scrlStyles[key].setValue();
            this.scrlStyles[key].previous = MathUtils.lerp(
                this.scrlStyles[key].previous,
                this.scrlStyles[key].current,
                this.scrlStyles[key].ease
            );
        }
        // then translate scrollable div
        this.setPosition();

        // render loop
        requestAnimationFrame(() => this.render());
    }
}

/*------------------------------------------------------------------------------------------------------------------*/
/*	Preload
--------------------------------------------------------------------------------------------------------------------*/

// Preload images

let IMAGES;

const preloadImages = new Promise((resolve, reject) => {
    imagesLoaded(document.querySelectorAll("img"), { background: true }, resolve);
});

preloadImages.then(images => {
    IMAGES = images.images;
});

// Anything else what has to be preloaded can be added here
const preloadEverything = [preloadImages];

// After loaded
Promise.all(preloadEverything).then(() => {
    // Remove the loader
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");

    getTopScroll();
    new SmoothScroll();
});



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

// let createDigital = gsap.timeline({
//     scrollTrigger: {
//         trigger: ".hero-wrapper",
//         start: "top-=80 top",
//         scrub: true,
//         // pin: true,
//         // markers: true
//     }
// })

// createDigital.to(".hero-wrapper", {
//     y: "10vw",
//     // ease: "power1.inOut"
// })


/*------------------------------------------------------------------------------------------------------------------*/
/*	Madness Rotation on Scroll
--------------------------------------------------------------------------------------------------------------------*/

// var rotate = gsap.timeline({
//     scrollTrigger: {
//         trigger: ".showreel-wrapper__title",
//         start: 'top bottom',
//         scrub: true,
//     }
// })
// rotate.from("#textIT", {
//     attr: { startOffset: "60%" },
//     duration: 500,
//     ease: 'none'
// })


/*------------------------------------------------------------------------------------------------------------------*/
/*	Scroll to Showreel 
--------------------------------------------------------------------------------------------------------------------*/

// function srSec() {
//     // console.log('yeees');
//     gsap.set("body", { overflowX: "hidden", overflowY: "hidden" });
//     gsap.to(window, {
//         duration: 1,
//         scrollTo: { y: ".showreel-wrapper__content-sr", autoKill: false },
//         overwrite: true,
//         onComplete: () => gsap.set("body", { overflowX: "hidden", overflowY: "auto" })
//     });
// }
// // function heroSec() {
// //     gsap.to(window, { duration: 1, scrollTo: { y: ".header", offsetY: 0 } });
// // }

// ScrollTrigger.create({
//     trigger: ".showreel-wrapper__content-sr",
//     start: 'top bottom-=100',
//     onEnter: () => srSec(),
// })

/*------------------------------------------------------------------------------------------------------------------*/
/*	Blotter text animation
--------------------------------------------------------------------------------------------------------------------*/

// let fontSize = $(window).width() * 0.2

// // $(window).on('resize', function () {
// //     let fontSize = $(window).width() * 0.2
// //     console.log(fontSize);

// //     return fontSize
// // })

// var text1 = new Blotter.Text("CREATE", {
//     family: 'Lucifer Sans SemiExp Light',
//     size: fontSize,
//     leading: 1.3,
//     weight: 300,
//     fill: "#FFDA13"
// })
// var text2 = new Blotter.Text("DIGITAL", {
//     family: 'Lucifer Sans SemiExp Light',
//     size: fontSize,
//     leading: 1.3,
//     weight: 300,
//     fill: "#FFDA13"
// })

// var material = new Blotter.LiquidDistortMaterial();
// material.uniforms.uVolatility.value = 0.03;
// material.uniforms.uSeed.value = 0.1;
// material.uniforms.uSpeed.value = 0.3;


// var blotter = new Blotter(material, {
//     texts: [text1, text2]
// })

// let heroTxt1 = document.getElementById('heroTxt1')
// let heroTxt2 = document.getElementById('heroTxt2')

// var scope = blotter.forText(text1);
// var scope2 = blotter.forText(text2);

// scope.appendTo(heroTxt1);
// scope2.appendTo(heroTxt2);

// document.onmousemove = moveIt;
// function moveIt(event) {

//     material.uniforms.uRotation.value = (event.clientX * .1);
//     material.uniforms.uOffset.value = (event.clientX * .0001);

// }


// let playLetters = gsap.timeline()

// playLetters.fromTo('.showreel-wrapper__content-sr--v_play-txt span', { transform: "translateY(1vw)" }, { transform: "translateY(0vw)" })


const playBtn = document.getElementsByClassName('showreel-wrapper__content-sr--v_play')
const sr = document.getElementsByClassName('showreel-wrapper__content-sr--v')
const srContent = document.getElementsByClassName('showreel-wrapper__content-sr--v_content')


const setSrPos = (clientX, clientY) => {
    gsap.to(playBtn, 0.5, {
        left: clientX,
        top: clientY,
    });
    gsap.to(srContent, 0.8, {
        left: -clientX / 20,
        top: -clientY / 20,
    });
};

$(sr).on('mouseenter', function (e) {

    var clientX = e.pageX - $(this).offset().left;
    var clientY = e.pageY - $(this).offset().top;

    setSrPos(clientX, clientY);

    // playLetters.play()
})

$(sr).on('mouseleave', function (e) {
    gsap.to(playBtn, 0.5, {
        top: "50%",
        left: "50%",
        transform: "translate( -50%, -50%)"
    })
    gsap.to(srContent, 0.8, {
        top: 0,
        left: 0
    })
})

$(sr).on('mousemove', function (e) {
    var clientX = e.pageX - $(this).offset().left;
    var clientY = e.pageY - $(this).offset().top;

    setSrPos(clientX, clientY);
})


let onPlayClick = gsap.timeline({paused: true})

onPlayClick.to('.showreel-wrapper__content-sr--v_play', {
    opacity: 0,
    duration: 0.5
}, 'together')
onPlayClick.to('.showreel-wrapper__content-sr--v_content', {
    display: "none",
    opacity: 0,
    duration: 0.5
}, 'together')

$('.showreel-wrapper__content-sr--v_play').on('click', function () {
    if ($('.showreel-wrapper__content-sr--v').hasClass('active')){
        $('.showreel-wrapper__content-sr--v').removeClass('active')
        onPlayClick.reverse()
        $('.showreel-wrapper__content-sr--v_video')[0].pause()
    } else {
        $('.showreel-wrapper__content-sr--v').addClass('active')
        onPlayClick.play()
        $('.showreel-wrapper__content-sr--v_video')[0].play()
    }
});




let heroBtns = document.querySelectorAll('.hero-wrapper__bottom-cont')

heroBtns.forEach((heroBtn) => {

    // 1. Set the function and variables
    function parallaxIt(e, target, movement = 0.2) {
        var boundingRect = heroBtn.getBoundingClientRect();
        var relX = e.pageX - boundingRect.left;
        var relY = e.pageY - boundingRect.top;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        gsap.to(target, {
            x: (relX - boundingRect.width / 2) * movement,
            y: (relY - boundingRect.height / 2 - scrollTop) * movement,
            ease: "power1",
            duration: 0.6
        });
    }

    function callParallax(e) {
        parallaxIt(e, $(heroBtn).find('.hero-wrapper__bottom-a'));
    }
    heroBtn.addEventListener('mousemove', function (e) {
        callParallax(e);
        console.log('moving');
    });

    heroBtn.addEventListener('mouseleave', function (e) {
        gsap.to($(heroBtn).find('.hero-wrapper__bottom-a'), {
            scale: 1,
            x: 0,
            y: 0,
            ease: "power3",
            duration: 0.6
        });
    });
    
})







