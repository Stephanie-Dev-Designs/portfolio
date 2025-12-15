const imageGrid = document.getElementById('image-grid');
const circlesContainer = document.getElementById('season-circles');
const infoBox = document.getElementById('image-info');
const infoTitle = document.getElementById('info-title');
const infoText = document.getElementById('info-text');
const navItems = document.querySelectorAll('.season-nav li');

// Seasonal data with fixed images
const seasons = {
  autumn: {
    images: [
      "./imgs/autumn-1.jpg",
      "./imgs/autumn-2.jpg",
      "./imgs/autumn-3.jpg",
      "./imgs/autumn-4.jpg",
      "./imgs/autumn-5.jpg",
      "./imgs/autumn-6.jpg",
    
   
    ],
    descriptions: {
      1: { title: "Golden Light", text: "A soft golden sunset through crisp leaves." },
      2: { title: "Rustic Path", text: "Amber trees lining a peaceful forest walk." },
      3: { title: "Falling Leaves", text: "A breeze carrying warm autumn tones." },
      4: { title: "Harvest Mood", text: "Textures of wood, wool, and quiet calm." },
      5: { title: "Season’s Glow", text: "Warm tones reflecting change and rest." }
    },
    colors: ["#C46210","#D2691E","#B7410E","#8B4513","#FF8C00"]
  },
  winter: {
    images: [
      "./imgs/winter-1.jpg",
      "./imgs/winter-2.jpg",
      "./imgs/winter-3.jpg",
      "./imgs/winter-4.jpg",
      "./imgs/winter-5.jpg",
      "./imgs/winter-6.jpg"
  
    ],
    descriptions: {
      1: { title: "Frozen Stillness", text: "Cool tones and peaceful snowdrifts." },
      2: { title: "Frosted Branches", text: "Nature paused in gentle silence." },
      3: { title: "Crisp Air", text: "Clarity and quiet moments of reflection." },
      4: { title: "Winter Light", text: "Soft greys and silver tones of morning." },
      5: { title: "Hearth Glow", text: "The warmth of home amidst the cold." }
    },
    colors: ["#C0D6E4","#A7BBC7","#88A6B0","#6B7C8C","#4C5A67"]
  },
  spring: {
    images: [
      "./imgs/spring-1.jpg",
      "./imgs/spring-2.jpg",
      "./imgs/spring-3.jpg",
      "./imgs/spring-4.jpg",
      "./imgs/spring-5.jpg",
      "./imgs/spring-6.jpg",
      "./imgs/spring-7.jpg"
      

    ],
    descriptions: {
      1: { title: "Fresh Bloom", text: "Soft pastels and new beginnings." },
      2: { title: "Morning Dew", text: "Light reflecting off young petals." },
      3: { title: "Awakening", text: "Life returns to every branch and leaf." },
      4: { title: "Gentle Breeze", text: "Movement and renewal in every color." },
      5: { title: "Warm Rain", text: "A soft rhythm on windows and fields." }
    },
    colors: ["#E057BA","#9C58E0","#5892E0","#58BDE0","#FFB7B2"]
  },
  summer: {
    images: [
      "./imgs/summer-1.jpg",
      "./imgs/summer-2.jpg",
      "./imgs/summer-3.jpg",
      "./imgs/summer-4.jpg",
      "./imgs/summer-5.jpg"
    
   
    ],
    descriptions: {
      1: { title: "Sunlit Shore", text: "Vibrant blues and golden sands." },
      2: { title: "Wild Bloom", text: "Flowers reaching for endless light." },
      3: { title: "Warm Horizon", text: "Days stretching into golden evenings." },
      4: { title: "Ocean Mist", text: "Cool refreshment under open skies." },
      5: { title: "Citrus Glow", text: "Energy and brightness in every hue." }
    },
    colors: ["#58B9E0","#614549","#4185E0","#FF4500","#FFB347"]
  }
};

// Initial season
let currentSeason = "autumn";
loadSeason(currentSeason);

// Nav click
navItems.forEach(item => {
  item.addEventListener('click', () => {
    currentSeason = item.dataset.season;
    loadSeason(currentSeason);
  });

  // Hover color
  item.addEventListener('mouseover', () => {
    switch(item.dataset.season){
      case 'autumn': item.style.color = '#FF8C00'; break;
      case 'winter': item.style.color = '#1E90FF'; break;
      case 'spring': item.style.color = '#FF69B4'; break;
      case 'summer': item.style.color = '#32CD32'; break;
    }
  });
  item.addEventListener('mouseout', () => {
    item.style.color = '#555';
  });
});

// Load season function
function loadSeason(season) {
  const { images, descriptions, colors } = seasons[season];
  imageGrid.innerHTML = "";
  circlesContainer.innerHTML = "";
  infoBox.classList.remove('show');

  images.forEach((src, index) => {
    const box = document.createElement('div');
    box.classList.add('img-box');
    box.dataset.id = index + 1;

    const img = document.createElement('img');
    img.src = src;
    box.appendChild(img);
    imageGrid.appendChild(box);

    // Staggered fade-in for masonry
    setTimeout(() => box.classList.add('show'), 50 * index);

    // Info box click
    box.addEventListener('click', () => {
      const { title, text } = descriptions[index + 1];
      infoTitle.textContent = title;
      infoText.textContent = text;
      infoBox.classList.add('show');
    });
  });

  // Circles
  colors.forEach(color => {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.style.background = color;
    circlesContainer.appendChild(circle);
  });
}


