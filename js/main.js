let KEY_CODE_RELOAD = 181;
let KEY_CODE_ENTER = 13;
let KEY_CODE_UP_ARROW = 38;
let KEY_CODE_DOWN_ARROW = 40;
let KEY_CODE_TAB = 9;

let before = document.getElementById("before");
let liner = document.getElementById("liner");
let command = document.getElementById("typer"); 
let textarea = document.getElementById("texter"); 
let terminal = document.getElementById("terminal");

let commandIndex = 0;
let passwordModeEnabled = false;
let isPasswordCorrect = false;
let commands = [];

setTimeout(function() {
  loopLines(banner, "", 80);
  textarea.focus();
}, 10);

window.addEventListener("keyup", enterKey);

console.log(
  "%cYou hacked my password!😠",
  "color: #04ff00; font-weight: bold; font-size: 24px;"
);
console.log("%cPassword: '" + password + "' - I wonder what it does?🤔", "color: grey");

// init
textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  if (e.keyCode == KEY_CODE_RELOAD) {
    document.location.reload(true);
    return;
  }

  if (passwordModeEnabled) {
    handlePasswordInput(e);
  } else {
    handleCommandInput(e);
  }
}

function handlePasswordInput(e) {
  let et = "*";
  let w = textarea.value.length;
  command.innerHTML = et.repeat(w);

  if (textarea.value === password) {
    isPasswordCorrect = true;
  }

  if (isPasswordCorrect && e.keyCode == KEY_CODE_ENTER) {
    processCorrectPassword();
  } else if (e.keyCode == KEY_CODE_ENTER) {
    processIncorrectPassword();
  }
}

function processCorrectPassword() {
  loopLines(secret, "color2 margin", 120);
  command.innerHTML = "";
  textarea.value = "";
  isPasswordCorrect = false;
  passwordModeEnabled = false;
  liner.classList.remove("password");
}

function processIncorrectPassword() {
  addLine("Wrong password", "error", 0);
  command.innerHTML = "";
  textarea.value = "";
  passwordModeEnabled = false;
  liner.classList.remove("password");
}

function handleCommandInput(e) {
  if (e.keyCode == KEY_CODE_ENTER) {
    processEnterKeyPress();
  } else if (e.keyCode == KEY_CODE_UP_ARROW) {
    handleUpArrowKeyPress();
  } else if (e.keyCode == KEY_CODE_DOWN_ARROW) {
    handleDownArrowKeyPress();
  }
}

function processEnterKeyPress() {
  commands.push(command.innerHTML);
  commandIndex = commands.length;
  addLine("visitor@suslov.co:~$ " + command.innerHTML, "no-animation", 0);
  commander(command.innerHTML.toLowerCase());
  command.innerHTML = "";
  textarea.value = "";
}

function handleUpArrowKeyPress() {
  if (commandIndex > 0) {
    commandIndex -= 1;
    while (commandIndex > 0 && commands[commandIndex].trim() === '') {
      commandIndex -= 1;
    }
    if (commands[commandIndex].trim() !== '') {
      textarea.value = commands[commandIndex];
      command.innerHTML = textarea.value;
    }
  }
}

function handleDownArrowKeyPress() {
  if (commandIndex < commands.length - 1) {
    commandIndex += 1;
    while (commandIndex < commands.length - 1 && commands[commandIndex].trim() === '') {
      commandIndex += 1;
    }
    if (commands[commandIndex].trim() !== '') {
      textarea.value = commands[commandIndex];
      command.innerHTML = textarea.value;
    } else {
      textarea.value = '';
      command.innerHTML = '';
    }
  }
}

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
      loopLines(whoami, "color2 margin", 80);
      break;
    case "sudo":
      addLine("Oh no, you're not admin...", "color2", 80);
      setTimeout(function() {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      }, 1000); 
      break;
    case "social":
      loopLines(social, "color2 margin", 80);
      break;
    case "secret":
      liner.classList.add("password");
      passwordModeEnabled = true;
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
      let subject = "Message from your website";
      let body = "Hello Andrei,\n\nI visited your website and wanted to reach out.\n\n";
      window.location.href = "mailto:andrei.suslov.dev@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      break;
    case "clear":
      setTimeout(function() {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
      }, 1);
      break;
    case "banner":
      loopLines(banner, "", 80);
      break;
    // socials
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

function newTab(link) {
  setTimeout(function() {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time) {
  let t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }
  setTimeout(function() {
    let next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;

    before.parentNode.insertBefore(next, before);

    window.scrollTo(0, document.body.offsetHeight);
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function(item, index) {
    addLine(item, style, index * time);
  });
}

document.addEventListener('click', function(event) {
  let textarea = document.getElementById('texter');
  let selection = window.getSelection();
  if (event.target.tagName !== 'A' && selection.type !== 'Range') {
    textarea.focus();
  }
});

let links = document.getElementsByTagName('a');
for (let element of links) {
  element.addEventListener('click', function(event) {
    event.stopPropagation();
  });
}
