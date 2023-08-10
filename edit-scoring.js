document.getElementById('addScoreMapping').onclick = function(key) {
    createMapping();
};

document.getElementById('updateScoreMappings').onclick = function(key) {
    console.log("show");
    updateMappingsAndDisplay();
};

function createMapping() {
    globalState.scoreMappings.push({phrase: "", sponsorScore: 1, cosponsorScore: 1});
    updateMappings();
    displayScoreMappings();
}

function displayScoreMappings() {
    var scoreMappingsDiv = document.getElementById('scoreMappings');
    removeAllChildren(scoreMappingsDiv);

    globalState.scoreMappings.forEach((mapping) => {
        var scoreMappingContainer = document.createElement('div');
        scoreMappingContainer.className = "scoreMappingContainer";
        scoreMappingsDiv.appendChild(scoreMappingContainer);

        var phraseEdit = document.createElement('input');
        var sponsorScoreEdit = document.createElement('input');
        var cosponsorScoreEdit = document.createElement('input');

        scoreMappingContainer.appendChild(phraseEdit);
        scoreMappingContainer.appendChild(sponsorScoreEdit);
        scoreMappingContainer.appendChild(cosponsorScoreEdit);

        phraseEdit.type = "text";
        phraseEdit.className = "phraseEditor";
        phraseEdit.value = mapping.phrase;
        phraseEdit.placeholder = "case insensitive phrase";
        phraseEdit.onkeydown = function(key) {
            if (key.key == "Enter") {
                updateMappingsAndDisplay();
            }
        }

        sponsorScoreEdit.type = "number";
        sponsorScoreEdit.className = "sponsorScoreEditor";
        sponsorScoreEdit.value = mapping.sponsorScore;
        sponsorScoreEdit.placeholder = "positive number";
        sponsorScoreEdit.onkeydown = function(key) {
            if (key.key == "Enter") {
                updateMappingsAndDisplay();
            }
        }

        cosponsorScoreEdit.type = "number";
        cosponsorScoreEdit.className = "cosponsorScoreEditor";
        cosponsorScoreEdit.value = mapping.cosponsorScore;
        cosponsorScoreEdit.placeholder = "positive number";
        cosponsorScoreEdit.onkeydown = function(key) {
            if (key.key == "Enter") {
                showSpinner();
                updateMappingsAndDisplay();
            }
        }
    });
}

function updateMappings() {
    var scoreMappingContainers = document.getElementsByClassName("scoreMappingContainer");
    for (var i = 0; i < scoreMappingContainers.length; i++) {
        var uiMapping = scoreMappingContainers[i];
        var mapping = globalState.scoreMappings[i];

        mapping.phrase = uiMapping.getElementsByClassName("phraseEditor")[0].value;
        if (mapping.phrase == null) {
            mapping.phrase = "";
        }
        mapping.sponsorScore = parseInt(uiMapping.getElementsByClassName("sponsorScoreEditor")[0].value);
        if (mapping.sponsorScore == null) {
            mapping.sponsorScore = 1;
        }
        mapping.cosponsorScore = parseInt(uiMapping.getElementsByClassName("cosponsorScoreEditor")[0].value);
        if (mapping.cosponsorScore == null) {
            mapping.cosponsorScore = 1;
        }
    }
}

function updateMappingsAndDisplay() {
    showSpinner();
    setTimeout(() => {
        updateMappings();
        displayScoreMappings();
        calculateAndDisplayScores();
        displayTeams();
        hideSpinner();
    }, 0);
}