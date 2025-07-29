let loader = document.querySelector('.loading-screen');
let mainContainer = document.querySelector('.container');

function loadScreen() {
    loader.style.display = "none";
    mainContainer.style.display = "flex";
}
window.addEventListener("load", ()=>{
    setTimeout(loadScreen, 1000)
})