let loader = document.querySelector('.loading-screen'); // Loading Screen
let mainContainer = document.querySelector('.container'); // main full screen

// loading screen 
function loadScreen() {
    loader.style.display = "none";
    mainContainer.style.display = "grid";
}
window.addEventListener("load", ()=>{
    setTimeout(loadScreen, 300)
})



const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;

  try {
    const res = await fetch('http://127.0.0.1:5050/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, remember })
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = '/FrontEnd/Authorization/login.html';
    } else {
      alert(`❌ Error: ${data.error}`);
    }
  } catch (err) {
    console.error(err);
    alert('⚠️ Network error. Try again.');
  }
});
