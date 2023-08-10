function removeAllChildren(parent) {
    while (parent.firstChild != null) {
        parent.removeChild(parent.firstChild);
    }
}

function showSpinner() {
    document.getElementById("loading-container").style.visibility = "visible";
    var images = document.getElementsByClassName("loading-spinner");
    var indexToShow = Math.floor(Math.random(images.length) * images.length);
    if (indexToShow == globalState.lastSpinnerIndex) {
        indexToShow++;
        indexToShow %= images.length;
    }
    globalState.lastSpinnerIndex = indexToShow;
    images[indexToShow].style.visibility = "visible";
}

function hideSpinner() {
    document.getElementById("loading-container").style.visibility = "hidden";
    for (let image of document.getElementsByClassName("loading-spinner")) {
        image.style.visibility = "hidden";
    }
}