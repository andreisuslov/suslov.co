// Commander function to process commands
function commander(cmd) {
	switch (cmd.toLowerCase()) {
		case 'help':
			loopLines(help, 'color2 margin', 80);
			break;
		case 'whois':
			loopLines(whois, 'color2 margin', 80);
			break;
		case '':
			break;
		case 'whoami':
			const randomHaiku = getRandomHaiku(whoami);
			loopLines(randomHaiku, 'color2 margin', 80);
			break;
		case 'sudo':
			addLine("Oh no, you're not admin...", 'color2', 80);
			setTimeout(function () {
				window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
			}, 1000);
			break;
		case 'social':
			loopLines(social, 'color2 margin', 80);
			break;
		case 'secret':
			liner.classList.add('password');
			passwordModeEnabled = true;
			$('prompt').innerText = 'Password:';
			break;
		case 'projects':
			loopLines(projects, 'color2 margin', 80);
			break;
		case 'exploit':
			loopLines(exploit, 'color2 margin', 80);
			break;
		case 'password':
			addLine(
				'<span class="inherit"> Lol! You\'re joking, right? You\'re gonna have to try harder than that!😂</span>',
				'error',
				100,
			);
			break;
		case 'history':
			addLine('<br>', '', 0);
			loopLines(commands, 'color2', 80);
			addLine('<br>', 'command', 80 * commands.length + 50);
			break;
		case 'email':
			const subject = 'Message from your website';
			const body =
				'Hello Andrei,\n\nI visited your website and wanted to reach out.\n\n';
			window.location.href = `mailto:andrei.suslov.dev@gmail.com?subject=${encodeURIComponent(
				subject,
			)}&body=${encodeURIComponent(body)}`;
			break;
		case 'clear':
			setTimeout(function () {
				terminal.innerHTML = '<a id="before"></a>';
				before = $('before');
			}, 1);
			break;
		case 'banner':
			loopLines(banner, 'no-gap', 0);
			break;
		// Socials
		case 'linkedin':
			addLine('Opening LinkedIn...', 'color2', 0);
			newTab(linkedin);
			break;
		case 'github':
			addLine('Opening GitHub...', 'color2', 0);
			newTab(github);
			break;
		default:
			addLine(
				'<span class="inherit">Command not found. For a list of commands, type <span class="command">\'help\'</span>.</span>',
				'error',
				100,
			);
			break;
	}
}

// Open a new tab
function newTab(link) {
	setTimeout(function () {
		window.open(link, '_blank');
	}, 500);
}

// Add a line to the terminal
function addLine(text, style, time) {
	let formattedText = text.replace(/  /g, '&nbsp;&nbsp;');
	setTimeout(function () {
		let next = document.createElement('p');
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
			let newLine = document.createElement('p');
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
		'<span class="command">who am I</span>',
	);
	lines.unshift('<br>');
	lines.push('<br>');
	return lines;
}

// Remove newline characters from text
const removeNewlines = (text) => text.replace(/\n/g, '');
