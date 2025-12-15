const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle nav menu
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});

// Dropdown accordion
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const dropdown = link.nextElementSibling;

    // Close other dropdowns
    document.querySelectorAll('.dropdown').forEach(d => {
      if (d !== dropdown) d.classList.remove('show');
    });

    // Toggle current dropdown
    dropdown.classList.toggle('show');
  });
});
