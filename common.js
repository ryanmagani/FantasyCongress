function removeAllChildren(parent) {
    while (parent.firstChild != null) {
        parent.removeChild(parent.firstChild);
    }
}