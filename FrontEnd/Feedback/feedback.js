let loader = document.querySelector(".loading-screen")
let mainContainer = document.querySelector(".container")
let reviewBtn = document.getElementById("btnofreview")
let feedForm = document.querySelector(".feedback-form")
let feedSubject = document.querySelector(".feedback-form__subject")
let feedDesc = document.querySelector(".feedback-form__message")


// loading screen 
function loadScreen() {
  loader.style.display = "none";
  mainContainer.style.display = "flex";
}
window.addEventListener("load", () => {
  setTimeout(loadScreen, 300)
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


// Customized as per page Alert Show Function
function showAlert(message, limit) {
  document.querySelector(".alertMsg").innerText = message;
  document.querySelector(".alertBox").style.display = "flex";
  mainContainer.classList.add("blurClass")
  setTimeout(() => {
    closeAlert()
  }, limit);
}
// Template Alert Hide Function
function closeAlert() {
  document.querySelector(".alertBox").style.display = "none";
  mainContainer.classList.remove("blurClass")
}

// submitting the review
reviewBtn.addEventListener('click', function (e) {
  e.preventDefault();
  let fs = feedSubject.value.trim();
  let fd = feedDesc.value.trim();
  if (!fs) {
    showAlert('Please Enter A Subject !', 2000)
  } else if (!fd) {
    showAlert('Please Enter A Description !', 2000)
  } else if (fs.length < 5) {
    showAlert('Subject Should At Least\nBe 5 Alphabets', 2000)
  } else if (fd.length < 30) {
    showAlert('Description Should At Least\nBe 30 Alphabets', 2000)
  } else {
    feedForm.reset();
    showAlert('Thanks For Your Feedback \n It Really Means A Lot !', 4500)
    setTimeout(() => {
      window.location.href = '/FrontEnd/Chat/chat.html';
    }, 4500);
  }

})