import $ from 'jquery';
import imagesLoaded from "imagesLoaded";
import '../scss/main.scss';
import '../index.html';



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

    // getTopScroll();
    // new SmoothScroll();
});








