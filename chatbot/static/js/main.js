// Get navbar links
var navbarLinks = document.querySelectorAll(".navbar a");

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
    var navbar = document.querySelector(".navbar");
    // Check if page is at the top
    var isAtTop = window.pageYOffset < 5;
    
    // If not at the top, add the navbar-scrolled class, else remove it
    if (!isAtTop) {
        navbar.classList.add("navbar-scrolled");
    } else {
        navbar.classList.remove("navbar-scrolled");
    }

    // Check if page is at the top, with a small buffer
    var isAtTop = window.pageYOffset < 5;

    // If page is not at the top, remove active class from all links
    if (!isAtTop) {
        for (var i = 0; i < navbarLinks.length; i++) {
            navbarLinks[i].classList.remove("active");
        }
    }

    // Get current section by checking viewport against all sections
    var sections = document.querySelectorAll(".section");
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        // Check if section is in viewport
        if (section.offsetTop <= window.pageYOffset && section.offsetTop + section.offsetHeight > window.pageYOffset) {
            // Find corresponding navbar link
            var id = section.getAttribute("id");
            var activeLink = document.querySelector(".navbar a[href='#" + id + "']");
            // Add active class
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    }
});

// Set the first link as active on page load
navbarLinks[0].classList.add("active");


/*

// Get navbar links
var navbarLinks = document.querySelectorAll(".navbar a");

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
    // Check if page is at the top
    var isAtTop = window.pageYOffset === 0;

    // If page is not at the top, remove active class from all links
    if (!isAtTop) {
        for (var i = 0; i < navbarLinks.length; i++) {
            navbarLinks[i].classList.remove("active");
        }
    }

    // Get current section by checking viewport against all sections
    var sections = document.querySelectorAll(".section");
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        // Check if section is in viewport
        if (section.offsetTop <= window.pageYOffset && section.offsetTop + section.offsetHeight > window.pageYOffset) {
            // Find corresponding navbar link
            var id = section.getAttribute("id");
            var activeLink = document.querySelector(".navbar a[href='#" + id + "']");
            // Add active class
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    }
});

// Set the first link as active on page load
navbarLinks[0].classList.add("active");

*/

/*

// Get navbar links
var navbarLinks = document.querySelectorAll(".navbar a");

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
            var activeLink = document.querySelector(".navbar a[href='#" + id + "']");
            // Add active class
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    }
});

// Set the first link as active on page load
navbarLinks[0].classList.add("active");

*/
