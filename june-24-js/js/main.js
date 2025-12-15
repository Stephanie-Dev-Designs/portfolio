//declare items
const navLinks = document.querySelectorAll("#nav-items li");
const logo = document.getElementById("logo");
let sections = document.querySelectorAll("section");

//manipulate
logo.addEventListener("click", changeSection);

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", changeSection);  
}

//functions
function changeSection(e) {
    let selection = e.target;
    let newSectionId = selection.getAttribute('data-id');
    let newSection = document.getElementById(newSectionId);

    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
    }

    newSection.classList.add('active');
}




