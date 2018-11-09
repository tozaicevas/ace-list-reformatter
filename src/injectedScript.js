editorDOM = document.querySelector('.ace_editor');

if (editorDOM) {
	let editor = ace.edit(editorDOM);
	let selectedTextRange = editor.selection.getRange();
	let selectedText = editor.getSession().doc.getTextRange(selectedTextRange);

	document.dispatchEvent(new CustomEvent('getSelectedTextEvent', {
		detail: {
			selectedText: selectedText
		}
	}));

	document.addEventListener('replaceSelectedTextEvent', function replace(e) {
		const { replaceText } = e.detail;
		if (replaceText)
			editor.getSession().doc.replace(selectedTextRange, replaceText);
		document.removeEventListener('replaceSelectedTextEvent', replace);
	});
}
else
	alert('Webpage has no ace editor.');

delete editorDom;
