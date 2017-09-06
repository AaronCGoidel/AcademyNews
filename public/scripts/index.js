/**
 * index.js
 * - All our useful JS goes here, awesome!
 */

console.log("JavaScript is amazing!");

function openNav() {
    document.getElementsByTagName("body")[0].className = "sidenav-open";
}

function closeNav() {
    document.getElementsByTagName("body")[0].className = "";
}

(function initMainSlider() {
    var main_slider = new Swiper('.main-slider > .swiper-container', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 0,
        loop: true,
        autoHeight: true
    });

    var section_slider = new Swiper('.content-slider > .swiper-container', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 30,
        loop: true,
        simulateTouch: false
    });
})();
