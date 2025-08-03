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


// Reset Password function

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const emailField = document.getElementById("emailField");
  const passwordField = document.getElementById("passwordField");
  const form = document.getElementById("forgotForm");
  if (!form) {
    console.log("form not found")
    return
  }
  const submitBtn = document.getElementById("submitBtn");

  if (token) {
    // We are in "Reset password via token" mode
    emailField.style.display = "none";
    const email = document.getElementById("email");
    email.style.display = "none";
    passwordField.style.display = "block";
    submitBtn.value = "Reset Password";

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById("newPassword").value;
      if (!newPassword) {
        showAlert("Enter A Password !")
      } else {
        const res = await fetch("http://127.0.0.1:5050/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
          credentials: 'include'
        });

        const data = await res.json();
        setTimeout(() => {
          if (res.ok || res === 201) {
            showAlert("Password Reset Successful !\nRedirecting To Login")
            setTimeout(() => {
              window.location.href = "login.html";
            }, 2000);
          } else {
            showAlert(`${data.error}`);
          }
        }, 1500);


      }

    });

  } else {
    // We are in "Request reset link" mode
    passwordField.style.display = "none";
    emailField.style.display = "block";
    submitBtn.value = "Send Reset Link";
    const newPassword = document.getElementById("newPassword");
    newPassword.style.display = "none";

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      if (!email) {
        showAlert("Please Enter An Email !")
      } else {
        const res = await fetch("http://127.0.0.1:5050/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          credentials: 'include'
        });

        const data = await res.json();
        setTimeout(() => {
          if (res.ok) {
            showAlert("Reset link sent to your email.");
            form.reset()
          } else {
            showAlert(`${data.error}`);
          }
        }, 1500);

      }

    });
  }
});
