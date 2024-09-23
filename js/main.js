// DOM element selector
const $ = (id) => document.getElementById(id);

// Initialize the terminal emulator
function initialize() {
  cursor = $('cursor');
  canvas = document.createElement('canvas');
  context = canvas.getContext('2d');

  const promptStyle = window.getComputedStyle($('prompt'));
  context.font = `${promptStyle.fontSize} ${promptStyle.fontFamily}`;

  const promptText = $('prompt').textContent;
  // 53 looks good on my desktop, I don't feel like calaculating it 
  const promptWidth = context.measureText(promptText).width + 53; 

  cursor.style.left = '0px';
  cursor.style.marginLeft = `${promptWidth}px`;

  // Store promptWidth as a global variable for later use
  window.promptWidth = promptWidth;

  // Initialize other elements
  before = $('before');
  liner = $('liner');
  command = $('typer');
  textArea = $('texter');
  terminal = $('terminal');

  // Set prompt text
  textArea.value = "";
  command.innerHTML = "";
  $('prompt').innerText = "visitor@suslov.co:~$";

  // Display the banner
  setTimeout(function () {
    loopLines(banner, "", 80);
    textArea.focus();
  }, 10);

  // Event listeners
  window.addEventListener("keyup", enterKey);
  textArea.addEventListener('keydown', handleTabKeyPress);
  textArea.addEventListener('input', typeIt);
  textArea.addEventListener('keydown', moveIt);
  document.addEventListener('click', focusTextArea);
  document.addEventListener('keydown', focusTextArea);

  // Console messages
  console.log(
    "%cYou hacked my password!😠",
    "color: #04ff00; font-weight: bold; font-size: 24px;"
  );
  console.log(`%cPassword: '${password}' - I wonder what it does?🤔`, "color: grey");
}

// Initialize the terminal
window.addEventListener('load', initialize);
