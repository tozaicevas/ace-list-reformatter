const numberRegex = /^\s*\d+\./;
const whiteRegex = /^\s*$/;
// any number that ends with dot and starts the line (whitespaces are omitted)

var reformattedText = null;

document.addEventListener('reformatValue', function() {
	injectScript('src/injectedScript.js');
	// injected script returns selected text from ace-editor
	// through getSelectedTextEvent
});

document.addEventListener('getSelectedTextEvent', (e) => {
	let selectedText = e.detail.selectedText;
	let lines = getLines(selectedText);
	if (!lines) {
		alert('Please select a string.');
		return;
	}
	let isNumerical = checkIfNumericalList(lines);
	if (!isNumerical.isNumericalList) {
		alert(`Can't reformat a non-numerical list.\n${isNumerical.wrongLines}`);
		return;
	}
	reformattedText = getReformattedText(lines);
});

function injectScript(name) {
	let script = document.createElement('script');
	script.src = chrome.runtime.getURL(name);
	(document.head || document.documentElement).appendChild(script);
	script.onload = function() {
		if (reformattedText) {
			document.dispatchEvent(new CustomEvent('replaceSelectedTextEvent', {
				detail: {
					replaceText: reformattedText
				}
			}));
		    script.remove();
		}
	};
}

function getReformattedText(lines) {
	let reformattedLines = getReformattedLines(lines);
	let reformattedText = reformattedLines.join('\n');
	return reformattedText;
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

function checkIfNumericalList(lines) {
	// check if given array of lines is a numerical list
	let isNumericalList = true;
	let wrongLines = '';
	for (let line of lines) {
		if (!numberRegex.test(line) && !whiteRegex.test(line)) {
			wrongLines += line + '\n';
			isNumericalList = false;
		}
	}
	return {
		isNumericalList: isNumericalList,
		wrongLines: wrongLines
	}
}

function getReformattedLines(lines) {
	let reformattedLines = [];
	let i = 1;
	for (let line of lines)
		reformattedLines.push(whiteRegex.test(line) ? line : getReformattedLine(line, i++));
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
