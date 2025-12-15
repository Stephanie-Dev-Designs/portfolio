const questions = document.querySelectorAll('.faq-question');

questions.forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('active');

    // Close all first
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      const ans = i.querySelector('.faq-answer');
      ans.style.height = '0';
    });

    // Reopen if it was not open
    if (!isOpen) {
      item.classList.add('active');
      // Force browser to reflow to make transition reliable (fixes last one)
      answer.style.height = 'auto';
      const fullHeight = answer.scrollHeight + 'px';
      answer.style.height = '0';
      setTimeout(() => {
        answer.style.height = fullHeight;
      }, 10);
    }
  });
});
