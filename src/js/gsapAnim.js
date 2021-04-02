import $ from 'jquery';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

$('document').ready(function () {

    let worksSlides = document.getElementById('worksSlides')

    gsap.to(worksSlides, 1, {
        x: () => -(worksSlides.scrollWidth - document.documentElement.clientWidth) + "px",
        ease: "none",
        scrollTrigger: {
            trigger: worksSlides,
            invalidateOnRefresh: true,
            pin: true,
            scrub: 1,
            ease: "Sine.easeInOut",
            end: () => "+=" + worksSlides.offsetWidth
        }
    })

    const charming = require('charming')

    let menuItems = document.querySelectorAll(".header-wrapper__menu-el a")


    menuItems.forEach(item => {
        charming(item);

        const letters = [...item.querySelectorAll('span')];

        let lettersAnim = gsap.timeline({paused: true})
        lettersAnim.to(letters, 0.2, {
            ease: "Sine.easeInOut",
            startAt: { opacity: 1, transform: "translateY(0px)" },
            opacity: 0,
            transform: "translateY(15px)",
            yoyo: true,
            yoyoEase: "Back.easeOut",
            // repeat: 1,
            stagger: {
                grid: [1, letters.length - 1],
                from: 'center',
                amount: 0.12
            }
        });
        $(item).on('mouseenter', function () {
            // Letters effect
            lettersAnim.play() 

            lettersAnim.eventCallback("onComplete", function () {
                lettersAnim.add(lettersAnim.reverse(), "+=1")
            })
        });
        // $(item).on('mouseleave', function () {
        //     // Letters effect
        //     lettersAnim.reverse()
        // });

    })


    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".works-wrapper__slide-1 img", "skewY", "deg"), // fast
        clamp = gsap.utils.clamp(-20, 20); // don't let the skew go beyond 20 degrees. 

    ScrollTrigger.create({
        onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -300);
            // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
                proxy.skew = skew;
                gsap.to(proxy, { skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew) });
            }
        }
    });

    // make the right edge "stick" to the scroll bar. force3D: true improves performance
    gsap.set(".works-wrapper__slide-1 img", { transformOrigin: "right center", force3D: true });


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

    var rotate = gsap.timeline({
        scrollTrigger: {
            trigger: ".showreel-wrapper__title",
            // scroller: ".scroller",
            // pin: true,
            start: 'top center',
            scrub: true,
            // markers: true,
            end: "bottom bottom"
        }
    })
    rotate.from("#textIT", 0.5, {
        attr: { startOffset: "60%" },
        ease: 'none'
    })


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


    let onPlayClick = gsap.timeline({ paused: true })

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
        if ($('.showreel-wrapper__content-sr--v').hasClass('active')) {
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



});


