let loader = document.querySelector('.loading-screen'); // Loading Screen
let mainContainer = document.querySelector('.container'); // About us Page

// loading screen 
function loadScreen() {
    loader.style.display = "none";
    mainContainer.style.display = "flex";
}
window.addEventListener("load", ()=>{
    setTimeout(loadScreen, 3000)
});

