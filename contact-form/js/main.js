const form = document.getElementById("contact-form");
const statusText = document.getElementById("status");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: formData,
    headers: { 'Accept': 'application/json' },
  })
  .then(response => {
    if (response.ok) {
      statusText.textContent = "✅ Your message has been sent!";
      statusText.classList.remove("error");
      statusText.classList.add("success");
      form.reset();
    } else {
      response.json().then(data => {
        const errorMsg = data.errors ? data.errors.map(err => err.message).join(", ") : "❌ Failed to send message. Try again later.";
        statusText.textContent = errorMsg;
        statusText.classList.remove("success");
        statusText.classList.add("error");
      });
    }
  })
  .catch(() => {
    statusText.textContent = "❌ Failed to send message. Try again later.";
    statusText.classList.remove("success");
    statusText.classList.add("error");
  });
});
