/* nav toggle starts */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
/* nav toggle ends */

/* newsletter subscribe starts */
const newsletterForm = document.getElementById('newsletter-form');
const newsletterMsg = document.getElementById('newsletter-msg');

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  newsletterMsg.classList.remove('hidden');
  newsletterForm.reset();
});
/* newsletter subscribe ends */
