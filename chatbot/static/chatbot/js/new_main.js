// Get navbar links
var navbarLinks = document.querySelectorAll("nav a");
var navbar = document.querySelector("nav");

// Add click event to navbar links
for (var i = 0; i < navbarLinks.length; i++) {
    navbarLinks[i].addEventListener("click", function() {
        // Remove active styles from all links
        for (var i = 0; i < navbarLinks.length; i++) {
            navbarLinks[i].classList.remove("text-orange-600");
            navbarLinks[i].classList.remove("font-bold");
        }
        // Add active styles to clicked link
        this.classList.add("text-orange-600");
        this.classList.add("font-bold");
    });
}

// Update active link on scroll
window.addEventListener("scroll", function() {
    // Remove active styles from all links
    for (var i = 0; i < navbarLinks.length; i++) {
        navbarLinks[i].classList.remove("text-orange-600");
        navbarLinks[i].classList.remove("font-bold");
    }

    // Get current section by checking viewport against all sections
    var sections = document.querySelectorAll("section");
    var closestSection = null;
    var smallestDistance = Infinity;

    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var distance = Math.abs(window.pageYOffset - section.offsetTop);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestSection = section;
        }
    }

    // Find corresponding navbar link for the closest section
    if (closestSection) {
        var id = closestSection.getAttribute("id");
        var activeLink = document.querySelector("nav a[href='#" + id + "']");
        // Add active styles
        if (activeLink) {
            activeLink.classList.add("text-orange-600");
            activeLink.classList.add("font-bold");
        }
    }
});

// Set the home link as active on page load
var homeLink = document.querySelector("nav a[href='#home-section']");
if (homeLink) {
    homeLink.classList.add("text-orange-600");
    homeLink.classList.add("font-bold");
}

window.addEventListener("scroll", function() {
    if (window.scrollY > 0) {
        navbar.classList.add('shadow-md');
    } else {
        navbar.classList.remove('shadow-md');
    }
});
