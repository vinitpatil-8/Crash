let loader = document.querySelector('.loading-screen');
let mainContainer = document.querySelector('.container');

function loadScreen() {
    loader.style.display = "none";
    mainContainer.style.display = "flex";
}
window.addEventListener("load", ()=>{
    setTimeout(loadScreen, 1000)
})

// Login Protecting Page
fetch('http://127.0.0.1:5050/me', {
  method: 'GET',
  credentials: 'include' // 🔑 THIS sends session cookie
})
.then(res => res.json())
.then(data => {
  if (data.logged_in) {
    console.log("Welcome:", data.username);
    // maybe show username on screen?
  } else {
    // not logged in, redirect:
    window.location.href = '/FrontEnd/Authorization/login.html';
  }
})
.catch(err => {
  console.error(err);
  window.location.href = '/FrontEnd/Authorization/login.html';
});