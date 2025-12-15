const STORAGE_KEY = "realEstateOffersCanada";
const offersList = document.getElementById("offersList");
const highestStat = document.getElementById("highestStat");
const countStat = document.getElementById("countStat");
const emptyNote = document.getElementById("emptyNote");
const carousel = document.getElementById("carousel");
const provinceSelect = document.getElementById("provinceSelect");
const carouselContainer = document.getElementById("carouselContainer");

let offers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentIndex = 0;

// --- All Provinces & Homes Database ---
const homesByProvince = {
  Ontario: [
    { city: "Toronto", price: 950000, img: "imgs/toronto1.jpg" },
    { city: "Ottawa", price: 820000, img: "imgs/ottawa1.jpg" },
    { city: "Hamilton", price: 720000, img: "imgs/hamilton1.jpg" },
    { city: "Barrie", price: 640000, img: "imgs/barrie1.jpg" },
  ],
  Alberta: [
    { city: "Calgary", price: 670000, img: "imgs/calgary1.jpg" },
    { city: "Edmonton", price: 590000, img: "imgs/edmonton1.jpg" },
    { city: "Banff", price: 980000, img: "imgs/banff1.jpg" },
  ],
  BritishColumbia: [
    { city: "Vancouver", price: 1200000, img: "imgs/vancouver1.jpg" },
    { city: "Victoria", price: 970000, img: "imgs/victoria1.jpg" },
    { city: "Kelowna", price: 850000, img: "imgs/kelowna1.jpg" },
  ],
  Quebec: [
    { city: "Montreal", price: 770000, img: "imgs/montreal1.jpg" },
    { city: "Quebec City", price: 680000, img: "imgs/quebec1.jpg" },
    { city: "Laval", price: 640000, img: "imgs/laval1.jpg" },
  ],
  Manitoba: [
    { city: "Winnipeg", price: 520000, img: "imgs/winnipeg1.jpg" },
    { city: "Brandon", price: 460000, img: "imgs/brandon1.jpg" },
  ],
  Saskatchewan: [
    { city: "Regina", price: 510000, img: "imgs/regina1.jpg" },
    { city: "Saskatoon", price: 550000, img: "imgs/saskatoon1.jpg" },
  ],
  NovaScotia: [
    { city: "Halifax", price: 580000, img: "imgs/halifax1.jpg" },
    { city: "Sydney", price: 470000, img: "imgs/sydney1.jpg" },
  ],
  NewBrunswick: [
    { city: "Fredericton", price: 440000, img: "imgs/fredericton1.jpg" },
    { city: "Moncton", price: 460000, img: "imgs/moncton1.jpg" },
  ],
  Newfoundland: [
    { city: "St. John's", price: 410000, img: "imgs/stjohns1.jpg" },
    { city: "Corner Brook", price: 380000, img: "imgs/cornerbrook1.jpg" },
  ],
  PrinceEdwardIsland: [
    { city: "Charlottetown", price: 490000, img: "imgs/charlottetown1.jpg" },
    { city: "Summerside", price: 450000, img: "imgs/summerside1.jpg" },
  ],
};

// --- Province Selection ---
provinceSelect.addEventListener("change", () => {
  const province = provinceSelect.value;
  if (!province || !homesByProvince[province]) return;

  currentIndex = 0;
  showCarousel(province);
});

// --- Display Carousel for Selected Province ---
function showCarousel(province) {
  const homes = homesByProvince[province];
  carousel.innerHTML = "";

  homes.forEach((home, index) => {
    const homeDiv = document.createElement("div");
    homeDiv.classList.add("home-slide");
    if (index === 0) homeDiv.classList.add("active");

    homeDiv.innerHTML = `
      <img src="${home.img}" alt="${home.city}">
      <div class="home-details">
        <h3>${home.city}, ${province}</h3>
        <p>Price: $${home.price.toLocaleString()}</p>
        <button class="select-btn" data-city="${home.city}" data-price="${home.price}">
          Select Home
        </button>
      </div>
    `;
    carousel.appendChild(homeDiv);
  });

  setupCarouselNavigation();
}

// --- Carousel Navigation Setup ---
function setupCarouselNavigation() {
  let prevBtn = document.querySelector(".carousel-prev");
  let nextBtn = document.querySelector(".carousel-next");

  if (!prevBtn || !nextBtn) {
    prevBtn = document.createElement("button");
    nextBtn = document.createElement("button");

    prevBtn.textContent = "❮";
    nextBtn.textContent = "❯";

    prevBtn.className = "carousel-prev";
    nextBtn.className = "carousel-next";

    carouselContainer.appendChild(prevBtn);
    carouselContainer.appendChild(nextBtn);
  }

  prevBtn.onclick = () => changeSlide(-1);
  nextBtn.onclick = () => changeSlide(1);
}

function changeSlide(direction) {
  const slides = document.querySelectorAll(".home-slide");
  slides[currentIndex].classList.remove("active");
  currentIndex = (currentIndex + direction + slides.length) % slides.length;
  slides[currentIndex].classList.add("active");
}

// --- Offer System ---
function saveOffers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
  renderOffers();
}

document.getElementById("submitBtn").addEventListener("click", () => {
  const buyer = document.getElementById("buyerInput").value.trim();
  const amount = Number(document.getElementById("amountInput").value);

  if (!buyer || !amount) return alert("Please enter a name and amount.");

  const newOffer = {
    buyer,
    amount,
    time: new Date().toLocaleTimeString(),
  };

  offers.unshift(newOffer);
  saveOffers();
  document.getElementById("buyerInput").value = "";
  document.getElementById("amountInput").value = "";
});

document.getElementById("clearBtn").addEventListener("click", () => {
  if (confirm("Clear all offers?")) {
    offers = [];
    saveOffers();
  }
});

function renderOffers() {
  offersList.innerHTML = "";
  if (offers.length === 0) {
    emptyNote.style.display = "block";
    highestStat.textContent = "Highest: —";
    countStat.textContent = "Offers: 0";
    return;
  }

  emptyNote.style.display = "none";
  countStat.textContent = "Offers: " + offers.length;

  const highestOffer = offers.reduce((a, b) => (a.amount > b.amount ? a : b));
  highestStat.textContent = "Highest: $" + highestOffer.amount.toLocaleString();

  offers.forEach((offer) => {
    const div = document.createElement("div");
    div.classList.add("offer-item");
    if (offer.amount === highestOffer.amount) div.classList.add("highest", "flash");
    div.innerHTML = `
      <div><strong>${offer.buyer}</strong><br><small>${offer.time}</small></div>
      <div><strong>$${offer.amount.toLocaleString()}</strong></div>
    `;
    offersList.appendChild(div);
  });
}

renderOffers();
