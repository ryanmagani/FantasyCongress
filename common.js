function removeAllChildren(parent) {
    while (parent.firstChild != null) {
        parent.removeChild(parent.firstChild);
    }
}

function showSpinner() {
    document.getElementById("loading-container").style.visibility = "visible";
}

function hideSpinner() {
    document.getElementById("loading-container").style.visibility = "hidden";
}