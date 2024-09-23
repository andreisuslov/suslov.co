// DOM element selector
const $ = (id) => document.getElementById(id);

// Constants
const KEY_CODES = {
  A: 65,
  E: 69,
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  ENTER: 13,
  RELOAD: 181,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  TAB: 9,
};

// Command suggestions
const COMMAND_SUGGESTIONS = [
  "help",
  "whois",
  "whoami",
  "social",
  "secret",
  "projects",
  "password",
  "history",
  "email",
  "clear",
  "linkedin",
  "github",
];

// Global variables
let cursor, canvas, context, cursorIndex = 0;
let lastCommand = "";
let commandIndex = 0;
let passwordModeEnabled = false;
let isPasswordCorrect = false;
let commands = [];
let tabPressCount = 0;

// DOM elements
let before, liner, command, textArea, terminal;

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

// Remove newline characters from text
const removeNewlines = (text) => text.replace(/\n/g, '');

// Handle typing input
function typeIt(event) {
  const text = textArea.value;
  command.innerHTML = removeNewlines(text);
  cursorIndex = textArea.selectionStart;
  updateCursorPosition(text);
}

// Handle special key events
function moveIt(event) {
  const { keyCode } = event;
  const isCtrlPressed = event.ctrlKey;

  const actions = {
    [KEY_CODES.A]: () => moveCursorToStart(textArea),
    [KEY_CODES.E]: () => moveCursorToEnd(textArea),
    [KEY_CODES.LEFT_ARROW]: () => moveCursorLeft(textArea),
    [KEY_CODES.RIGHT_ARROW]: () => moveCursorRight(textArea),
    [KEY_CODES.ENTER]: () => moveCursorToEnd(textArea),
    [KEY_CODES.TAB]: () => autocompleteCommand(),
  };

  if (isCtrlPressed && actions[keyCode]) {
    actions[keyCode]();
    event.preventDefault();
  } else if (!isCtrlPressed && (keyCode === KEY_CODES.LEFT_ARROW || keyCode === KEY_CODES.RIGHT_ARROW)) {
    actions[keyCode]();
    event.preventDefault();
  }
}

// Cursor movement functions
function moveCursorToStart(sourceElement) {
  setCursorPosition(sourceElement, 0);
}

function moveCursorToEnd(sourceElement) {
  setCursorPosition(sourceElement, sourceElement.value.length);
}

function moveCursorLeft(sourceElement) {
  if (cursorIndex > 0) {
    setCursorPosition(sourceElement, cursorIndex - 1);
  }
}

function moveCursorRight(sourceElement) {
  if (cursorIndex < sourceElement.value.length) {
    setCursorPosition(sourceElement, cursorIndex + 1);
  }
}

function setCursorPosition(sourceElement, position) {
  cursorIndex = position;
  sourceElement.setSelectionRange(cursorIndex, cursorIndex);
  updateCursorPosition(sourceElement.value);
}

// Update cursor position based on text width
function updateCursorPosition(text) {
  const substring = text.slice(0, cursorIndex);
  const width = context.measureText(substring).width;
  cursor.style.left = `${width}px`;
}

// Handle Enter key events
function enterKey(e) {
  if (e.keyCode === KEY_CODES.RELOAD) {
    document.location.reload(true);
    return;
  }
  if (passwordModeEnabled) {
    handlePasswordInput(e);
  } else {
    handleCommandInput(e);
  }
}

// Handle password input
function handlePasswordInput(e) {
  let maskedInput = "*".repeat(textArea.value.length);
  command.innerHTML = maskedInput;

  if (textArea.value === password) {
    isPasswordCorrect = true;
  }

  if (e.keyCode === KEY_CODES.ENTER) {
    if (isPasswordCorrect) {
      processCorrectPassword();
    } else {
      processIncorrectPassword();
    }
  }
}

// Process correct password
function processCorrectPassword() {
  loopLines(secret, "color2 margin", 120);
  resetCommandLine();
  isPasswordCorrect = false;
  passwordModeEnabled = false;
  liner.classList.remove("password");
  $('prompt').innerText = "visitor@suslov.co:~$";
}

// Process incorrect password
function processIncorrectPassword() {
  addLine("Wrong password", "error", 0);
  resetCommandLine();
  passwordModeEnabled = false;
  liner.classList.remove("password");
  $('prompt').innerText = "visitor@suslov.co:~$";
}

// Handle command input
function handleCommandInput(e) {
  if (e.keyCode === KEY_CODES.ENTER) {
    processEnterKeyPress();
  } else if (e.keyCode === KEY_CODES.UP_ARROW) {
    handleUpArrowKeyPress();
  } else if (e.keyCode === KEY_CODES.DOWN_ARROW) {
    handleDownArrowKeyPress();
  }
}

// Process Enter key press
function processEnterKeyPress() {
  commands.push(command.innerHTML);
  commandIndex = commands.length;
  addLine("visitor@suslov.co:~$ " + command.innerHTML, "prompt-style", 0);
  commander(command.innerHTML.toLowerCase());
  resetCommandLine();

  // Reset cursor position
  cursor.style.left = '0px';
  cursor.style.marginLeft = `${window.promptWidth}px`;

  // Clear the input field
  textArea.value = '';
  $('typer').innerHTML = '';

  // Reset cursorIndex
  cursorIndex = 0;
}

// Handle Up Arrow key press
function handleUpArrowKeyPress() {
  let currentCommand = textArea.value.trim();  // Get the current command in the textarea
  
  if (commandIndex > 0) {
    commandIndex -= 1;
    // Keep moving back in the history if the command is identical to the current one
    while (commandIndex > 0 && commands[commandIndex].trim() === currentCommand) {
      commandIndex -= 1;
    }
    // Break the loop if we've reached the start of the command history
    if (commandIndex === 0 && commands[commandIndex].trim() === currentCommand) {
      return; // Prevent infinite loop by exiting early
    }
    // If you found a unique command, display it
    if (commands[commandIndex].trim() !== currentCommand) {
      textArea.value = commands[commandIndex].trim();
      command.innerHTML = textArea.value;
    }
  }
  moveCursorToEnd(textArea);
}

// Handle Down Arrow key press
function handleDownArrowKeyPress() {
  let currentCommand = textArea.value.trim();  // Get the current command in the textarea

  // Ensure that we don't go out of bounds
  if (commandIndex < commands.length - 1) {
    commandIndex += 1;
    
    // Keep moving forward in the history if the command is identical to the current one
    while (commandIndex < commands.length - 1 && commands[commandIndex].trim() === currentCommand) {
      commandIndex += 1;
    }

    // If we've reached beyond the last valid command, set command.innerHTML to empty
    if (commandIndex === commands.length - 1 && commands[commandIndex].trim() === currentCommand) {
      textArea.value = '';
      command.innerHTML = '';
      return;  // Exit early
    }
    
    // Set the value if it's a unique command
    if (commands[commandIndex].trim() !== currentCommand) {
      textArea.value = commands[commandIndex].trim();
      command.innerHTML = textArea.value;
    } else {
      // If it's the last command and there's no valid new command
      textArea.value = '';
      command.innerHTML = '';
    }
    moveCursorToEnd(textArea);
  } else {
    // If no more commands exist, clear the textArea and command.innerHTML
    textArea.value = '';
    command.innerHTML = '';
    moveCursorToStart(textArea);
  }
}

// Handle Tab key press
function handleTabKeyPress(e) {
  if (e.keyCode === KEY_CODES.TAB) {
    e.preventDefault(); // Prevent default tab behavior
    autocompleteCommand();
  }
}

// Autocomplete command
function autocompleteCommand() {
  const currentInput = textArea.value.trim().toLowerCase();

  // Reset tabPressCount if the input has changed
  if (currentInput !== lastCommand) {
    tabPressCount = 0;
  }

  const foundCommands = COMMAND_SUGGESTIONS.filter(cmd => cmd.startsWith(currentInput));
  if (foundCommands.length === 0) {
    clearAvailableCommandsLine();
  } else if (foundCommands.length === 1) {
    textArea.value = foundCommands[0];
    command.innerHTML = foundCommands[0];
    tabPressCount = 0; // Reset tab press count when command is fully autocompleted
    clearAvailableCommandsLine(); // Clear any existing "Available commands:" line
  } else if (foundCommands.length > 1) {
    tabPressCount += 1;
    const style = tabPressCount > 1 ? "color3" : "color2"; // Change style after the first Tab press
    updateCommandLine("Available commands: " + foundCommands.join(", "), style);
  }

  lastCommand = currentInput; // Update last command input
  moveCursorToEnd(textArea);
}

// Update command line with available commands
function updateCommandLine(text, style) {
  let existingLine = document.querySelector('.available-commands');
  if (existingLine) {
    existingLine.className = `${style} available-commands`;
    existingLine.innerHTML = text;
  } else {
    addLineOnTabAfterLiner(text, style, 0);
  }
}

// Reset command line input
function resetCommandLine() {
  command.innerHTML = "";
  textArea.value = "";
}

// Clear available commands line
function clearAvailableCommandsLine() {
  const existingLine = document.querySelector('.available-commands');
  if (existingLine) {
    existingLine.remove();
  }
}

// Commander function to process commands
function commander(cmd) {
  switch (cmd.toLowerCase()) {
    case "help":
      loopLines(help, "color2 margin", 80);
      break;
    case "whois":
      loopLines(whois, "color2 margin", 80);
      break;
    case "":
      break;
    case "whoami":
      const randomHaiku = getRandomHaiku(whoami);
      loopLines(randomHaiku, "color2 margin", 80);
      break;
    case "sudo":
      addLine("Oh no, you're not admin...", "color2", 80);
      setTimeout(function () {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      }, 1000);
      break;
    case "social":
      loopLines(social, "color2 margin", 80);
      break;
    case "secret":
      liner.classList.add("password");
      passwordModeEnabled = true;
      $('prompt').innerText = "Password:";
      break;
    case "projects":
      loopLines(projects, "color2 margin", 80);
      break;
    case "exploit":
      loopLines(exploit, "color2 margin", 80);
      break;
    case "password":
      addLine("<span class=\"inherit\"> Lol! You're joking, right? You\'re gonna have to try harder than that!😂</span>", "error", 100);
      break;
    case "history":
      addLine("<br>", "", 0);
      loopLines(commands, "color2", 80);
      addLine("<br>", "command", 80 * commands.length + 50);
      break;
    case "email":
      const subject = "Message from your website";
      const body = "Hello Andrei,\n\nI visited your website and wanted to reach out.\n\n";
      window.location.href = `mailto:andrei.suslov.dev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      break;
    case "clear":
      setTimeout(function () {
        terminal.innerHTML = '<a id="before"></a>';
        before = $('before');
      }, 1);
      break;
    case "banner":
      loopLines(banner, "no-gap", 0);
      break;
    // Socials
    case "linkedin":
      addLine("Opening LinkedIn...", "color2", 0);
      newTab(linkedin);
      break;
    case "github":
      addLine("Opening GitHub...", "color2", 0);
      newTab(github);
      break;
    default:
      addLine("<span class=\"inherit\">Command not found. For a list of commands, type <span class=\"command\">'help'</span>.</span>", "error", 100);
      break;
  }
}

// Open a new tab
function newTab(link) {
  setTimeout(function () {
    window.open(link, "_blank");
  }, 500);
}

// Add a line to the terminal
function addLine(text, style, time) {
  let formattedText = text.replace(/  /g, '&nbsp;&nbsp;');
  setTimeout(function () {
    let next = document.createElement("p");
    next.innerHTML = formattedText;
    next.className = style;
    before.parentNode.insertBefore(next, before);
    window.scrollTo(0, document.body.offsetHeight);
  }, time);
}

// Add a line after the liner when Tab is pressed
function addLineOnTabAfterLiner(text, style, time) {
  let formattedText = text.replace(/  /g, '&nbsp;&nbsp;');
  setTimeout(function () {
    let existingLine = document.querySelector('.available-commands');
    if (existingLine) {
      existingLine.innerHTML = formattedText;
      existingLine.className = `${style} available-commands`;
    } else {
      let newLine = document.createElement("p");
      newLine.innerHTML = formattedText;
      newLine.className = `${style} available-commands`;

      if (liner.nextSibling) {
        liner.parentNode.insertBefore(newLine, liner.nextSibling);
      } else {
        liner.parentNode.appendChild(newLine);
      }
    }
    window.scrollTo(0, document.body.scrollHeight);
  }, time);
}

// Loop through lines and add them to the terminal
function loopLines(name, style, time) {
  name.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
}

// Get random haiku for 'whoami' command
function getRandomHaiku(whoamiArray) {
  const randomIndex = Math.floor(Math.random() * whoamiArray.length);
  const haiku = whoamiArray[randomIndex];
  let lines = haiku.split('\n');
  const lastLineIndex = lines.length - 1;
  lines[lastLineIndex] = lines[lastLineIndex].replace(
    /who am I$/i,
    '<span class="command">who am I</span>'
  );
  lines.unshift('<br>');
  lines.push('<br>');
  return lines;
}

// Focus on the text area
function focusTextArea(event) {
  if (event.target.tagName !== 'A' && window.getSelection().type !== 'Range') {
    textArea.focus();
  }
}

// Initialize the terminal
window.addEventListener('load', initialize);
