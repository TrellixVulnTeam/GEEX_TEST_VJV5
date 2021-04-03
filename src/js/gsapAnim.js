import $ from 'jquery';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

$('document').ready(function () {

    /*------------------------------------------------------------------------------------------------------------------*/
    /*	Cursor
    --------------------------------------------------------------------------------------------------------------------*/
    var cursor = document.getElementById("cursor");

    if ($(window).width() > 1199) {
        // set the starting position of the cursor outside of the screen
        let clientX = -100;
        let clientY = -100;

        const initCursor = () => {
            // add listener to track the current mouse position
            document.addEventListener("mousemove", e => {
                clientX = e.clientX;
                clientY = e.clientY;
            });

            // transform the innerCursor to the current mouse position
            // use requestAnimationFrame() for smooth performance
            const render = () => {
                gsap.set(cursor, {
                    x: clientX,
                    y: clientY
                });
                requestAnimationFrame(render);
            };
            render();
        };

        $(".link").on('mouseenter', function (e) {
            gsap.to(cursor, 0.1, {
                transform: "scale(1.8)",
                opacity: 0.6,
                ease: "Sine.easeInOut"
            });
        });

        $(".link").on('mouseleave', function (e) {
            gsap.to(cursor, 0.1, {
                transform: "scale(1)",
                opacity: 0.8,
                ease: "Sine.easeInOut"
            });
        });

        initCursor();
    }


    /*------------------------------------------------------------------------------------------------------------------*/
    /*	On burger click
    --------------------------------------------------------------------------------------------------------------------*/

    let openMenu = gsap.timeline({paused: true})

    openMenu.to(".header-wrapper__menu", {
        transform: "translateX(0)",
        duration: 0.35,
        ease: "Sine.easeInOut"
    })  

    $(".header-wrapper__burger").on('click', function () {
        // $(".header-mobile").fadeToggle(200);
        $('#nav-icon').toggleClass('open');

        if ($(".header-wrapper__menu").hasClass("opened")){
            $(".header-wrapper__menu").removeClass("opened")
            openMenu.reverse()
        } else {
            $(".header-wrapper__menu").addClass("opened")
            openMenu.play()
        }
    })

    $(".header-wrapper__menu").on('click', function () {
        $(".header-wrapper__menu").removeClass("opened")
        openMenu.reverse()
        $('#nav-icon').removeClass('open');
    })

    $(window).on("scroll", function () {
        if ($(window).width() < 1280 && window.pageYOffset > 0) {
            $(".header-wrapper__menu").removeClass("opened")
            openMenu.reverse()
            $('#nav-icon').removeClass('open');
        }
    })


    /*------------------------------------------------------------------------------------------------------------------*/
    /*	Works Horizontal Scroll
    --------------------------------------------------------------------------------------------------------------------*/

    let worksSlides = document.getElementById('worksSlides')

    gsap.to(worksSlides, 1, {
        x: () => -(worksSlides.scrollWidth - document.documentElement.clientWidth) + "px",
        ease: "none",
        scrollTrigger: {
            trigger: worksSlides,
            start: "bottom bottom",
            invalidateOnRefresh: true,
            pin: true,
            scrub: 1,
            ease: "Sine.easeInOut",
            end: () => "+=" + worksSlides.offsetWidth
        }
    })

    /*------------------------------------------------------------------------------------------------------------------*/
    /*	Tilt effect on Works Horizontal Scroll
    --------------------------------------------------------------------------------------------------------------------*/

    let tilt = {
        value: 0
    }

    // Could have also used .set()
    let setTilt = gsap.quickSetter(".works-wrapper__slide-tilt img", "skewY", "deg") // fast

    // GSAP utility method - sets minimum and maximum values (-15 to 15 deg)
    let clamp = gsap.utils.clamp(-15, 15);

    ScrollTrigger.create({
        onUpdate: (thisScroll) => {

            // Setting tilt value
            let value = clamp(thisScroll.getVelocity() / -300);

            // Back to 0 smooth animation
            if (Math.abs(value) > Math.abs(tilt.value)) {

                tilt.value = value;
                gsap.to(tilt, {
                    value: 0,
                    duration: 1,
                    ease: "power2",
                    overwrite: true,
                    onUpdate: () => setTilt(tilt.value)
                });

            }
        }
    });

    // Setting transformOrigin and force3D (improves performance)
    gsap.set(".works-wrapper__slide-tilt img", {
        transformOrigin: "right center",
        force3D: true
    });



    /*------------------------------------------------------------------------------------------------------------------*/
    /*	Menu items on hover
    --------------------------------------------------------------------------------------------------------------------*/

    // Package that trims string into <span> letters
    const charming = require('charming')

    let menuItems = document.querySelectorAll(".header-wrapper__menu-el a")

    menuItems.forEach(item => {
        charming(item);

        const letters = [...item.querySelectorAll('span')];

        let lettersAnim = gsap.timeline({ paused: true })
        lettersAnim.to(letters, 0.2, {
            ease: "Sine.easeInOut",
            startAt: { opacity: 1, transform: "translateY(0px)" },
            opacity: 0,
            transform: "translateY(15px)",
            yoyo: true,
            yoyoEase: "Back.easeOut",
            stagger: {
                grid: [1, letters.length - 1],
                from: 'center',
                amount: 0.12
            }
        });
        $(item).on('mouseenter', function () {
            // Letters effect
            lettersAnim.play()

            // Reverse animation after play
            lettersAnim.eventCallback("onComplete", function () {
                lettersAnim.add(lettersAnim.reverse(), "+=1")
            })
        });
    })


    /*------------------------------------------------------------------------------------------------------------------*/
    /*	Madness Rotation on Scroll
    --------------------------------------------------------------------------------------------------------------------*/

    var rotate = gsap.timeline({
        scrollTrigger: {
            trigger: ".showreel-wrapper__title",
            start: 'top bottom',
            scrub: true,
            end: "bottom bottom"
        }
    })
    rotate.from("#textIT", 0.5, {
        attr: { startOffset: "60%" },
        ease: 'none'
    })


    /*------------------------------------------------------------------------------------------------------------------*/
    /*	PLAY button cursor and Showreel background animation
    --------------------------------------------------------------------------------------------------------------------*/

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

        gsap.to(cursor, {
            opacity: 0,
            duration: 0.1,
            ease: "Sine.easeInOut"
        })

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

        gsap.to(cursor, {
            opacity: 0.8,
            duration: 0.1,
            ease: "Sine.easeInOut"
        })
    })

    $(sr).on('mousemove', function (e) {
        var clientX = e.pageX - $(this).offset().left;
        var clientY = e.pageY - $(this).offset().top;

        setSrPos(clientX, clientY);
    })


    /*------------------------------------------------------------------------------------------------------------------*/
    /*	Hide Showreel background and play video on click
    --------------------------------------------------------------------------------------------------------------------*/

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

    /*------------------------------------------------------------------------------------------------------------------*/
    /*	Hero emoji on hover
    --------------------------------------------------------------------------------------------------------------------*/

    const items = document.querySelectorAll('.emoji-cont')

    if ($(window).width() > 1199) {
        items.forEach((el) => {
            const image = el.querySelector('.emoji')
            // const cursor = document.getElementById("cursor");

            $(el).on('mouseenter', function (e) {
                // gsap.to(cursor, 0.1, { autoAlpha: 0 })
                gsap.to(image, 0.1, { autoAlpha: 1 })

                // var clientX = e.clientX;
                // var clientY = e.clientY;

                var clientX = e.pageX - $(this).offset().left;
                var clientY = e.pageY - $(this).offset().top;


                const render = () => {
                    gsap.set(image, {
                        left: clientX,
                        top: clientY
                    });
                    // requestAnimationFrame(render);
                };
                render();
            })

            $(el).on('mouseleave', function (e) {
                // gsap.to(cursor, 0.1, { autoAlpha: 1 })
                gsap.to(image, 0.1, { autoAlpha: 0 })
            })

            $(el).on('mousemove', function (e) {
                // var clientX = e.clientX;
                // var clientY = e.clientY;

                // var clientX = e.pageX;
                // var clientY = e.pageY;

                var clientX = e.pageX - $(this).offset().left;
                var clientY = e.pageY - $(this).offset().top;

                const render = () => {
                    gsap.set(image, {
                        left: clientX,
                        top: clientY
                    });
                    // requestAnimationFrame(render);
                };
                render();
            })
        })
    }

    /*------------------------------------------------------------------------------------------------------------------*/
    /*	Sticky effect on hero buttons
    --------------------------------------------------------------------------------------------------------------------*/

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

    var rotateStar = gsap.timeline({
        scrollTrigger: {
            trigger: ".works",
            scrub: 0.2,
            start: 'top bottom',
            end: '+=10000',
        }
    })
        .to(".works-sphere img", {
            rotation: 360 * 5,
            duration: 1,
            ease: 'none'
        })

});


