// Smooth scroll to species section when clicking "Learn More"
document.getElementById('learnMore').addEventListener('click', () => {
  document.getElementById('species').scrollIntoView({ behavior: 'smooth' });
});

// Simple contact form handler
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Thanks for contacting SharkWorld! We’ll get back to you soon.');
  e.target.reset();
});