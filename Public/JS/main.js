
// Scroll Reveal

document.addEventListener("DOMContentLoaded", () => {
    ScrollReveal().reveal('.home-h1', {
        distance: '60px',
        duration: 1000,
        easing: 'ease-in-out',
        origin: 'top',
        delay: 100
    }),

    ScrollReveal().reveal('.search form', {
        distance: '60px',
        duration: 1000,
        easing: 'ease-in-out',
        origin: 'bottom',
        delay: 100
    }),

    ScrollReveal().reveal('.recipe1', {
        distance: '180px',
        duration: 1000,
        easing: 'ease-in-out',
        origin: 'right'
    }),

    ScrollReveal().reveal('.recipe2', {
        distance: '180px',
        duration: 1000,
        easing: 'ease-in-out',
        origin: 'left'
    })
});