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


const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;

  try {
    const res = await fetch('http://127.0.0.1:5050/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, remember }),
      credentials: 'include' // ✅ needed here too!
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = '/FrontEnd/Chat/chat.html';
    } else {
      alert(`❌ Error: ${data.error}`);
    }
  } catch (err) {
    console.error(err);
    alert('⚠️ Network error. Try again.');
  }
});
