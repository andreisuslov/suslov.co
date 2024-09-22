// DOM element selector
const $ = (id) => document.getElementById(id);

// Global variables
let cursor, canvas, ctx, cursorIndex = 0;

// Constants
const KEY_CODES = {
  A: 65,
  E: 69,
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  ENTER: 13
};

// Initialize the terminal emulator
function initialize() {
  cursor = $('cursor');
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');

  const promptStyle = window.getComputedStyle($('prompt'));
  ctx.font = `${promptStyle.fontSize} ${promptStyle.fontFamily}`;

  const promptText = $('prompt').textContent;
  const promptWidth = ctx.measureText(promptText).width + 33;

  cursor.style.left = '0px';
  cursor.style.marginLeft = `${promptWidth}px`;

  // Store promptWidth as a global variable for later use
  window.promptWidth = promptWidth;
}

// Remove newline characters from text
const removeNewlines = (text) => text.replace(/\n/g, '');

// Handle typing input
function typeIt(sourceElement, event) {
  const typer = $('typer');
  const text = sourceElement.value;

  typer.innerHTML = removeNewlines(text);
  cursorIndex = sourceElement.selectionStart;
  updateCursorPosition(text);
}

// Handle special key events
function moveIt(sourceElement, event) {
  const { keyCode, ctrlKey } = event;
  const isCtrlPressed = ctrlKey;

  const actions = {
    [KEY_CODES.A]: () => moveCursorToStart(sourceElement),
    [KEY_CODES.E]: () => moveCursorToEnd(sourceElement),
    [KEY_CODES.LEFT_ARROW]: () => moveCursorLeft(sourceElement),
    [KEY_CODES.RIGHT_ARROW]: () => moveCursorRight(sourceElement),
    [KEY_CODES.ENTER]: () => handleEnterKey(sourceElement)  // Add Enter key handler
  };

  if (isCtrlPressed && actions[keyCode]) {
    actions[keyCode]();
    event.preventDefault();
  } else if (!isCtrlPressed && (keyCode === KEY_CODES.LEFT_ARROW || keyCode === KEY_CODES.RIGHT_ARROW || keyCode === KEY_CODES.ENTER)) {
    actions[keyCode]();
    event.preventDefault();
  }
}

// Add new function to handle Enter key press
function handleEnterKey(sourceElement) {
  // Reset cursor position to promptWidth
  cursor.style.left = '0px';
  cursor.style.marginLeft = `${window.promptWidth}px`;
  
  // Clear the input field
  sourceElement.value = '';
  $('typer').innerHTML = '';
  
  // Reset cursorIndex
  cursorIndex = 0;
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
  const width = ctx.measureText(substring).width;
  cursor.style.left = `${width}px`;
}

// Override default alert function
function alertMessage(message) {
  console.log(message);
}

// Initialize the terminal emulator when the window loads
window.addEventListener('load', initialize);