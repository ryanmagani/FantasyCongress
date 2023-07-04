document.getElementById('addScoreMapping').onclick = function(key) {
    createMapping();
};

function createMapping() {
    globalState.scoreMappings.push({phrase: "", sponsorScore: 1, cosponsorScore: 1});
    displayScoreMappings();
    calculateScores();
}

function displayScoreMappings() {
    var scoreMappingsDiv = document.getElementById('scoreMappings');
    removeAllChildren(scoreMappingsDiv);

    globalState.scoreMappings.forEach((mapping) => {
        var phraseEdit = document.createElement('input');
        var sponsorScoreEdit = document.createElement('input');
        var cosponsorScoreEdit = document.createElement('input');

        phraseEdit.type = "text";
        phraseEdit.className = "phraseEditor";
        phraseEdit.value = mapping.phrase;
        phraseEdit.placeholder = "case insensitive phrase";
        // todo: figure out if this can be updated with blur without throwing
        // phraseEdit.onblur = function() {
        //     updateMapping(mapping, phraseEdit, sponsorScoreEdit, cosponsorScoreEdit);
        // }
        phraseEdit.onkeydown = function(key) {
            if (key.key == "Enter") {
                updateMapping(mapping, phraseEdit, sponsorScoreEdit, cosponsorScoreEdit);
            }
        }
        scoreMappingsDiv.appendChild(phraseEdit);

        sponsorScoreEdit.type = "number";
        sponsorScoreEdit.className = "sponsorScoreEditor";
        sponsorScoreEdit.value = mapping.sponsorScore;
        sponsorScoreEdit.placeholder = "positive number";
        // sponsorScoreEdit.onblur = function() {
        //     updateMapping(mapping, phraseEdit, sponsorScoreEdit, cosponsorScoreEdit);
        // }
        sponsorScoreEdit.onkeydown = function(key) {
            if (key.key == "Enter") {
                updateMapping(mapping, phraseEdit, sponsorScoreEdit, cosponsorScoreEdit);
            }
        }
        scoreMappingsDiv.appendChild(sponsorScoreEdit);

        cosponsorScoreEdit.type = "number";
        cosponsorScoreEdit.className = "cosponsorScoreEditor";
        cosponsorScoreEdit.value = mapping.cosponsorScore;
        cosponsorScoreEdit.placeholder = "positive number";
        // cosponsorScoreEdit.onblur = function() {
        //     updateMapping(mapping, phraseEdit, sponsorScoreEdit, cosponsorScoreEdit);
        // }
        cosponsorScoreEdit.onkeydown = function(key) {
            if (key.key == "Enter") {
                updateMapping(mapping, phraseEdit, sponsorScoreEdit, cosponsorScoreEdit);
            }
        }
        scoreMappingsDiv.appendChild(cosponsorScoreEdit);
    });
}

function updateMapping(mapping, phraseEdit, sponsorScoreEdit, cosponsorScoreEdit) {
    mapping.phrase = phraseEdit.value;
    mapping.sponsorScore = parseInt(sponsorScoreEdit.value);
    mapping.cosponsorScore = parseInt(cosponsorScoreEdit.value);
    displayScoreMappings();
    calculateAndDisplayScores();
}