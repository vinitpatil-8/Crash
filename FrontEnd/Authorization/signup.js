let loader = document.querySelector('.loading-screen'); // Loading Screen
let mainContainer = document.querySelector('.container'); // main full screen

// loading screen 
function loadScreen() {
  loader.style.display = "none";
  mainContainer.style.display = "grid";
}
window.addEventListener("load", () => {
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


const signupForm = document.getElementById('signupForm');

signupForm?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  // const remember = document.getElementById('remember').checked;
  try {
    let res = await fetch('http://127.0.0.1:5050/signup', {method: 'POST', headers:{ 'Content-Type':'application/json'}, body: JSON.stringify({email,username,password}), credentials: 'include'});
    const data = await res.json();
    
    if (res.ok || res === 201) {
      localStorage.setItem("pendingEmail", email);
      showAlert("You Are Getting Redirected\n To Verification")
      setTimeout(() => {
        window.location.href = 'http://127.0.0.1:5500/FrontEnd/Authorization/verify.html';
      }, 6000);
      signupForm.reset()
    } else {
      showAlert(`Error: ${data.error}`);
    }
  } catch (err) {
    console.log(err)
    showAlert(' Network error \n Try again')
  }
});
