let loader = document.querySelector('.loading-screen'); // Loading Screen
let mainContainer = document.querySelector('.container'); // main full screen
const resendBtn = document.getElementById('resend-btn'); // Resend Email Button
const countdownText = document.getElementById('countdown-text'); // Disabled Button Countdown

// loading screen 
function loadScreen() {
    loader.style.display = "none";
    mainContainer.style.display = "grid";
}
window.addEventListener("load", ()=>{
    setTimeout(loadScreen, 3000)
})

// Template Alert Show Function
function showAlert(message) {
  document.querySelector(".alertMsg").innerText = message;
  document.querySelector(".alertBox").style.display = "flex";
  mainContainer.classList.add("blurClass")
  setTimeout(() => {
    closeAlert()
  }, 6000);
}
// Template Alert Hide Function
function closeAlert() {
  document.querySelector(".alertBox").style.display = "none";
  mainContainer.classList.remove("blurClass")
}

// Disabled Button Countdown
let countdown = 60;
let interval = setInterval(() => {
  countdown--;
  resendBtn.textContent = `Resend Email (${countdown}s)`;
  if (countdown <= 0) {
    clearInterval(interval);
    resendBtn.disabled = false;
    resendBtn.textContent = "Resend Email";
  }
}, 1000);

// Resend Email Function
resendBtn.addEventListener('click', async () => {
  const email = localStorage.getItem("pendingEmail");
  if (!email) {
    showAlert("No email found. Please sign up again.");
    return;
  }

  resendBtn.disabled = true;
  resendBtn.textContent = "Resending...";

  try {
    const res = await fetch('http://127.0.0.1:5050/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }) // ✅ send email
    });

    const data = await res.json();
    if (res.ok) {
      showAlert("Email sent again. Check your inbox.");
    } else {
      showAlert(`${data.error}`);
    }
  } catch (err) {
    showAlert("Network error. Try again.");
  } finally {
    resendBtn.disabled = false;
    resendBtn.textContent = "Resend Email";
  }





  // Restart timer
  countdown = 60;
  resendBtn.disabled = true;
  resendBtn.textContent = `Resend Email (${countdown}s)`;
  interval = setInterval(() => {
    countdown--;
    resendBtn.textContent = `Resend Email (${countdown}s)`;
    if (countdown <= 0) {
      clearInterval(interval);
      resendBtn.disabled = false;
      resendBtn.textContent = "Resend Email";
    }
  }, 1000);
});