document.addEventListener('DOMContentLoaded', createButtonListener, false);

function createButtonListener() {
    let checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', () => {

        chrome.tabs.executeScript( {
            code: "document.dispatchEvent(new CustomEvent('reformatValue'));"
        });

    }, false);
}
