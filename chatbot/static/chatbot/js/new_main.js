// Get navbar links
var navbarLinks = document.querySelectorAll("nav a");

// Add click event to navbar links
for (var i = 0; i < navbarLinks.length; i++) {
    navbarLinks[i].addEventListener("click", function() {
        // Remove active class from all links
        for (var i = 0; i < navbarLinks.length; i++) {
            navbarLinks[i].classList.remove("active");
        }
        // Add active class to clicked link
        this.classList.add("active");
    });
}

// Update active link on scroll
window.addEventListener("scroll", function() {
    // Remove active class from all links
    for (var i = 0; i < navbarLinks.length; i++) {
        navbarLinks[i].classList.remove("active");
    }
    // Get current section by checking viewport against all sections
    var sections = document.querySelectorAll(".section");
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        // Check if section is in viewport
        if (section.offsetTop <= window.pageYOffset && section.offsetTop + section.offsetHeight > window.pageYOffset) {
            // Find corresponding navbar link
            var id = section.getAttribute("id");
            var activeLink = document.querySelector(".nav a[href='#" + id + "']");
            // Add active class
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    }
});

// Set the home link as active on page load
var homeLink = document.querySelector("nav a[href='#home-section']");
if (homeLink) {
    homeLink.classList.add("active");
}