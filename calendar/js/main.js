const monthYearElement = document.getElementById("monthYear");
const datesElement = document.getElementById("dates");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentDate = new Date();

const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = (firstDay.getDay() + 6) % 7; // Adjust so Mon=0
    const lastDayIndex = (lastDay.getDay() + 6) % 7;

    monthYearElement.textContent = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

    let datesHTML = "";

    // Previous month inactive dates
    for (let i = firstDayIndex; i > 0; i--) {
        const prevDates = new Date(currentYear, currentMonth, -i + 1);
        datesHTML += `<div class="date inactive">${prevDates.getDate()}</div>`;
    }

    // Current month dates
    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date.toDateString() === new Date().toDateString() ? "active" : "";
        datesHTML += `<div class="date ${activeClass}">${i}</div>`;
    }

    // Next month inactive dates
    for (let i = 1; i < 7 - lastDayIndex; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }

    datesElement.innerHTML = datesHTML;
};

// Navigation buttons
prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

// Initialize calendar
updateCalendar();
