var editorDOM = document.querySelector('.ace_editor');

if (editorDOM) {
	var editor = ace.edit(editorDOM);
	var selectedTextRange = editor.selection.getRange();
	var selectedText = editor.getSession().doc.getTextRange(selectedTextRange);

	document.dispatchEvent(new CustomEvent('getSelectedTextEvent', {
		detail: {
			selectedText: selectedText
		}
	}));

	document.addEventListener('replaceSelectedTextEvent', function replace(e) {
		editor.getSession().doc.replace(selectedTextRange, e.detail.replaceText);
		document.removeEventListener('replaceSelectedTextEvent', replace);
	});
}
else
	alert('Webpage has no ace editor.');
