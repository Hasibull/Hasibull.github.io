let toggler = document.querySelector(".navbar-toggle");
let navlinks = document.querySelector(".navbar-links");

toggler.addEventListener('click', () => {
    navlinks.classList.toggle("open");
})