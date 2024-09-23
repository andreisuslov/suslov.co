// Global variables
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

let cursor,
	canvas,
	context,
	cursorIndex = 0;
let lastCommand = '';
let commandIndex = 0;
let passwordModeEnabled = false;
let isPasswordCorrect = false;
let commands = [];
let tabPressCount = 0;

// DOM elements
let before, liner, command, textArea, terminal;

// Focus on the text area
function focusTextArea(event) {
  if (event.target.tagName !== 'A' && window.getSelection().type !== 'Range') {
    textArea.focus();
  }
}

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
	} else if (
		!isCtrlPressed &&
		(keyCode === KEY_CODES.LEFT_ARROW || keyCode === KEY_CODES.RIGHT_ARROW)
	) {
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
	let maskedInput = '*'.repeat(textArea.value.length);
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
	loopLines(secret, 'color2 margin', 120);
	resetCommandLine();
	isPasswordCorrect = false;
	passwordModeEnabled = false;
	liner.classList.remove('password');
	$('prompt').innerText = 'visitor@suslov.co:~$';
}

// Process incorrect password
function processIncorrectPassword() {
	addLine('Wrong password', 'error', 0);
	resetCommandLine();
	passwordModeEnabled = false;
	liner.classList.remove('password');
	$('prompt').innerText = 'visitor@suslov.co:~$';
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
	addLine('visitor@suslov.co:~$ ' + command.innerHTML, 'prompt-style', 0);
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
	let currentCommand = textArea.value.trim(); // Get the current command in the textarea

	if (commandIndex > 0) {
		commandIndex -= 1;
		// Keep moving back in the history if the command is identical to the current one
		while (
			commandIndex > 0 &&
			commands[commandIndex].trim() === currentCommand
		) {
			commandIndex -= 1;
		}
		// Break the loop if we've reached the start of the command history
		if (
			commandIndex === 0 &&
			commands[commandIndex].trim() === currentCommand
		) {
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
	let currentCommand = textArea.value.trim(); // Get the current command in the textarea

	// Ensure that we don't go out of bounds
	if (commandIndex < commands.length - 1) {
		commandIndex += 1;

		// Keep moving forward in the history if the command is identical to the current one
		while (
			commandIndex < commands.length - 1 &&
			commands[commandIndex].trim() === currentCommand
		) {
			commandIndex += 1;
		}

		// If we've reached beyond the last valid command, set command.innerHTML to empty
		if (
			commandIndex === commands.length - 1 &&
			commands[commandIndex].trim() === currentCommand
		) {
			textArea.value = '';
			command.innerHTML = '';
			return; // Exit early
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

	const foundCommands = COMMAND_SUGGESTIONS.filter((cmd) =>
		cmd.startsWith(currentInput),
	);
	if (foundCommands.length === 0) {
		clearAvailableCommandsLine();
	} else if (foundCommands.length === 1) {
		textArea.value = foundCommands[0];
		command.innerHTML = foundCommands[0];
		tabPressCount = 0; // Reset tab press count when command is fully autocompleted
		clearAvailableCommandsLine(); // Clear any existing "Available commands:" line
	} else if (foundCommands.length > 1) {
		tabPressCount += 1;
		const style = tabPressCount > 1 ? 'color3' : 'color2'; // Change style after the first Tab press
		updateCommandLine(
			'Available commands: ' + foundCommands.join(', '),
			style,
		);
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
	command.innerHTML = '';
	textArea.value = '';
}
