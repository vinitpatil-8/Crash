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



document.getElementById('forgotForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const newPassword = document.getElementById('newPassword').value;

  try {
    const res = await fetch('http://127.0.0.1:5050/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, newPassword })
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "login.html";
    } else {
      alert(`❌ ${data.error}`);
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Something went wrong.");
  }
});
