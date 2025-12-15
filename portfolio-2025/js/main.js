// logo - home starts
  const homeBtn = document.getElementById('homeBtn');
  const homeSection = document.getElementById('homeSection');

  window.onload = () => {
    homeSection.classList.add('show');
  };

  homeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    homeSection.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // logo - home ends 

