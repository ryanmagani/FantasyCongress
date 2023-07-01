document.getElementById('addTeamName').onkeydown = function(key) {
    if (key.key == "Enter") {
        createTeam();
    }
};

document.getElementById('addTeamButton').onclick = function(key) {
    createTeam();
};

function createTeam() {
    setTeamNameErrorMessage(null);
    var teamName = document.getElementById('addTeamName').value;
    if (teamName == "") {
        setTeamNameErrorMessage("Please enter a non-empty team name");
    }

    if (globalState.teams.has(teamName)) {
        setTeamNameErrorMessage("Team already exists");
    } else {
        globalState.teams.set(teamName, []);
    }
    displayTeams();
}

function setTeamNameErrorMessage(message) {
    document.getElementById('teamNameErrorMessage').innerText = message;
}

function displayTeams() {
    var parent = document.getElementById('editExistingTeamsDiv');
    removeAllChildren(parent);
    for ([team, teamMembers] of globalState.teams) {
        var teamDiv = document.createElement('div');
        parent.appendChild(teamDiv)
        
        var nameEdit = document.createElement('input');
        nameEdit.type = "text";
        nameEdit.className = "existingTeamNameEditor";
        nameEdit.value = team;
        teamDiv.appendChild(nameEdit);

        var removeTeamButton = document.createElement('input');
        removeTeamButton.type = "button";
        removeTeamButton.className="removeExistingTeamButton";
        removeTeamButton.value = "Remove team";
        teamDiv.appendChild(removeTeamButton);
        // TODO: figure out how to implement team deletion
    }
}