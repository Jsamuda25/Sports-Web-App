const hamburger = document.querySelector(".burger");
const navMenu = document.querySelector(".navmenu");

hamburger.addEventListener("click",()=>{
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n=> n.addEventListener("click",()=>{
    hamburger.classList.remove("active");
}));

console.log("hi")