const numberRegex = /^\s*\d+\./;
const whiteRegex = /^\s*$/;
// any number that ends with dot and starts the line (whitespaces are omitted)

let reformattedText = false;

document.addEventListener('reformatValue', function() {
	injectScript('src/injectedScript.js');
	// injected script returns selected text from ace-editor
	// through getSelectedTextEvent
});

document.addEventListener('getSelectedTextEvent', (e) => {
	let selectedText = e.detail.selectedText;
	if (!selectedText) {
		alert('Please select a string.');
		return;
	}
	let lines = getLines(selectedText);
	reformattedText = getReformattedText(lines);
});

function injectScript(name) {
	let script = document.createElement('script');
	script.src = chrome.runtime.getURL(name);
	script.onload = function() {
		document.dispatchEvent(new CustomEvent('replaceSelectedTextEvent', {
			detail: {
				replaceText: reformattedText
			}
		}));
		this.remove();
	};
	(document.head || document.documentElement).appendChild(script);
}

function getReformattedText(lines) {
	let reformattedLines = getReformattedLines(lines);
	let equalLines = true;
	reformattedLines.forEach((reformattedLine, index) =>
		equalLines = reformattedLine === lines[index] && equalLines);
	return !equalLines && reformattedLines.join('\n');
}

function getLines(text) {
	// returns array of lines in given string
	if (typeof(text) != 'string')
		return undefined;
	let char = '\n';
	let i = j = 0;
	let lines = [];

	while ((j = text.indexOf(char, i)) !== -1) {
		lines.push(text.substring(i, j));
		i = j + 1;
	}
	lines.push(text.substring(i));
	return lines;
}

function getReformattedLines(lines) {
	let reformattedLines = [];
	let i = 1;
	for (let line of lines) {
		let pushLine = (whiteRegex.test(line) || !numberRegex.test(line)) ? line : getReformattedLine(line, i++);
		reformattedLines.push(pushLine);
	}
	return reformattedLines;
}

function getReformattedLine(line, number) {
	let onlyNumberRegex = /\d+(?=\.)/;				// capture only the number
	let matchedStrings = onlyNumberRegex.exec(line);
	let matchedStartingIndex = matchedStrings.index;
	let matchedEndingIndex = matchedStrings[0].length + matchedStartingIndex;
	// index of the last digit + 1
	let reformattedLine = line.substring(0, matchedStartingIndex) + ('' + number) + line.substring(matchedEndingIndex);
	return reformattedLine;
}
