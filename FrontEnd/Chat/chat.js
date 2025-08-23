let menuBtn = document.querySelector('.menuBtn'); // 3 lines button
let closeBtn = document.querySelector('.closeBtn'); // Cross button
let sideBar = document.querySelector('.sidebar'); // Sidebar
let main = document.querySelector('.main'); // main chat screen
let chatBox = document.querySelector('.chatBox') // the chat box
let textArea = document.querySelector('#txtBox'); // Typing area
let typingBox = document.querySelector('.typingBox'); // The whole typing area
let sidebarBtns = document.querySelector('.sidebarBtns'); // Sidebar buttons area
let winWidth = window.innerWidth; // Get the width of the window
let loader = document.querySelector('.loading-screen'); // Loading Screen
let mainContainer = document.querySelector('.container'); // Main Page
let val // User's Message

// adding the contents of typing area to chat area
textArea.addEventListener('keypress', function(event) {
    if(event.key === 'Enter') {
        event.preventDefault();
        val = textArea.value.trim(); // Value of textArea
        if (val !== '') {
            displayMessage(val);
            handleSendClick()
            textArea.value = '';
        }
        return val
    }
});


// Sending User's Message To BackEnd
async function sendMessageToBot(message) {
  const response = await fetch('http://127.0.0.1:5050/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: message }),
    credentials: 'include'
  });

  const data = await response.json();
  return data.reply;
}

// Handling The Click
async function handleSendClick() {
    const botReply = await sendMessageToBot(val);
    showBotReply(botReply);
}

// Showing Bot's Reply
function showBotReply(message) {
  const msg = document.createElement('span');
  msg.className = 'bot-reply'; 
  msg.textContent = message;
  msg.innerHTML = message.replace(/\n/g, "<br>"); // line breaks
  msg.innerHTML = message.replace(/(https?:\/\/[^\s]+)/g,'<br><a href="$1" target="_blank" rel="noopener noreferrer">$1</a><br>'); // links
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function openning() {
  const opener = document.createElement('span');
  opener.className = 'bot-reply';
  let sentences = ["Select your preference :-", "What do u want today :-", "Make your choice :-", "Choose your option :-", "Take your pick :-"]
  let random = Math.floor(Math.random()*sentences.length);
  let selection = sentences[random];
  let context = "(type a corresponding number)<br>"
  opener.innerHTML = selection +"<br>"+ context + "<br><br>1. &nbsp;A joke<br>2. A Motivational quote<br>3. A Fun-Fact"
  chatBox.appendChild(opener);
}
openning()

// loading screen 
function loadScreen() {
    loader.style.display = "none";
    mainContainer.style.display = "flex";
}
window.addEventListener("load", ()=>{
    setTimeout(loadScreen, 300)
})


menuBtn.addEventListener('click', () => {
    let windowWidth = window.innerWidth; // Get the width of the window
    if (windowWidth<=768 && windowWidth>430){
        sideBar.style.width = "19%"; // Expand sidebar
        main.style.width = "81%";
    }else if(windowWidth<=430){
        sideBar.style.width = "30%"; // Expand sidebar
        main.style.width = "70%";
        textArea.disabled = "true" // disabling typing area
        main.style.opacity = "0.5" // making typing area and chat area opaque
    }else{
        sideBar.style.width = "15%"; // Expand sidebar
        main.style.width = "85%";
    }
    menuBtn.style.display = "none"; // Hide the 3 lines button
    setTimeout(() => {
        sidebarBtns.style.display = "flex"; // Show the buttons after a interval
        closeBtn.style.display = "block"; // Show the cross button after a interval
    }, 900);
});

closeBtn.addEventListener('click', () => {
    let windowWidth = window.innerWidth; // Get the width of the window
    if (windowWidth<=768 && windowWidth>430){
        sideBar.style.width = "8%"; // Collapse sidebar
        main.style.width = "92%";
    }else if(windowWidth<=430){
        sideBar.style.width = "10%"; // Collapse sidebar
        main.style.width = "90%";
        textArea.disabled = false // enabling typing area
        main.style.opacity = "1" // making typing area and chat as it was
    }else{
        sideBar.style.width = "4%"; // Collapse sidebar
        main.style.width = "96%";
    }
    menuBtn.style.display = "block"; // Show the 3 lines button
    closeBtn.style.display = "none"; // Hide the cross button
    sidebarBtns.style.display = "none"; // Hide the buttons
    
});



// function to display message
function displayMessage(text) {
  const msgSpan = document.createElement('span');
  msgSpan.textContent = text;
  msgSpan.className = 'user-reply'; 
  chatBox.appendChild(msgSpan);
  chatBox.scrollTop = chatBox.scrollHeight;
}

//scroll function
main.addEventListener('wheel', function(e){
    e.preventDefault();
    const isOverTypingBox = textArea.matches(':hover');
    const isOverType = typingBox.matches(':hover');
    if (isOverTypingBox) {
        textArea.scrollTop += e.deltaY;
    } else {
        if(isOverType){
        // do nothing
        }else{
            chatBox.scrollTop += e.deltaY;
        }
    }
}, { passive: false })

// touch support for scroll function

let startY = 0;
let activeScrollTarget = null;

main.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;

    const touch = e.touches[0];
    const touchedElement = document.elementFromPoint(touch.clientX, touch.clientY);

    if (textArea.contains(touchedElement)) {
      activeScrollTarget = textArea;
    } else {
        if (typingBox.contains(touchedElement)) {
            // do nothing
        }else{
            activeScrollTarget = chatBox;
        }
      
    }
});

main.addEventListener('touchmove', (e) => {
    if (!activeScrollTarget) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    startY = currentY;

    activeScrollTarget.scrollTop += deltaY;
    e.preventDefault(); // block default page scroll
  }, { passive: false });

main.addEventListener('touchend', () => {
    activeScrollTarget = null;
});



// toggle dark mode and light mode

const toggle = document.getElementById('themeToggle');

toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

// checks if the user's OS has dark mode as preference
window.addEventListener('DOMContentLoaded', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.body.classList.add('dark');
    toggle.checked = true;
  }
});






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
