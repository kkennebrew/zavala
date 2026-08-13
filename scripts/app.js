document.addEventListener("DOMContentLoaded", function () {

    const container = document.querySelector('.scroll-container');
    const prevBtn = document.querySelector('.scroll-btn.prev');
    const nextBtn = document.querySelector('.scroll-btn.next');

    function updateArrows() {
        if (!container) return;

        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (scrollLeft <= 5) {
            prevBtn.style.opacity = "0";
            prevBtn.style.pointerEvents = "none";
        } else {
            prevBtn.style.opacity = "0.9";
            prevBtn.style.pointerEvents = "auto";
        }

        if (scrollLeft >= maxScroll - 5) {
            nextBtn.style.opacity = "0";
            nextBtn.style.pointerEvents = "none";
        } else {
            nextBtn.style.opacity = "0.9";
            nextBtn.style.pointerEvents = "auto";
        }
    }

    if (container) {
        container.addEventListener("scroll", updateArrows);
        updateArrows();
    }

});

function scrollCarousel(direction) {
    const container = document.querySelector('.scroll-container');
    const width = container.clientWidth;

    container.scrollBy({
        left: direction * width,
        behavior: 'smooth'
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.addEventListener("scroll", function () {
    const btn = document.getElementById("backToTop");

    if (window.scrollY > 300) {
        btn.classList.add("show");
    } else {
        btn.classList.remove("show");
    }
});


(function () {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("primary-nav");

    toggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", isOpen);
        toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close menu after a link is tapped, so it doesn't stay open
    // when the page navigates on mobile.
    menu.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("nav-open");
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-label", "Open menu");
        });
    });
})();