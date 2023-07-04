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

    for ([teamName, teamMembers] of globalState.teams) {
        var teamDiv = document.createElement('div');
        parent.appendChild(teamDiv)
        
        var nameEdit = document.createElement('input');
        nameEdit.type = "text";
        nameEdit.className = "existingTeamNameEditor";
        nameEdit.value = teamName;
        teamDiv.appendChild(nameEdit);

        var removeTeamButton = document.createElement('input');
        removeTeamButton.type = "button";
        removeTeamButton.className="removeExistingTeamButton";
        removeTeamButton.value = "Remove team";
        removeTeamButton.onclick = function() {
            removeTeam(teamName);
        }
        teamDiv.appendChild(removeTeamButton);

        teamDiv.appendChild(document.createElement('br'));

        var allMemberInput = document.createElement('input');
        allMemberInput.placeholder = "add member";
        allMemberInput.setAttribute("list", "allMemberDataList");
        allMemberInput.onkeydown = function(key) {
            // key.key is null when clicking per https://stackoverflow.com/a/65073572
            if (key.key == null || key.key == "Enter") {
                addTeamMember(teamName, allMemberInput);
            }
        }
        teamDiv.appendChild(allMemberInput);

        var addMemberButton = document.createElement('input');
        addMemberButton.type = "button";
        addMemberButton.className = "addMemberButton";
        addMemberButton.value = "Add member";
        addMemberButton.onclick = function() {
            addTeamMember(teamName, allMemberInput);
        }
        teamDiv.appendChild(addMemberButton);

        teamMembers.forEach(teamMember => {
            teamDiv.appendChild(document.createElement('br'));
            
            var teamMemberParagraph = document.createElement('p');
            teamMemberParagraph.innerText = teamMember;
            teamDiv.appendChild(teamMemberParagraph);

            var removeTeamMemberButton = document.createElement('input');
            removeTeamMemberButton.type = "button";
            removeTeamMemberButton.className="removingTeamMember";
            removeTeamMemberButton.value = "Remove member";
            removeTeamMemberButton.onclick = function() {
                removeTeamMember(teamName, teamMember);
            }
            teamDiv.appendChild(removeTeamMemberButton);
        });
    }
}

function removeTeam(teamName) {
    globalState.teams.delete(teamName);
    displayTeams();
}

function addTeamMember(teamName, allMemberInput) {
    var member = allMemberInput.value;
    var existingTeamMembers = globalState.teams.get(teamName);
    if (!existingTeamMembers.includes(member) && globalState.members.has(member)) {
        existingTeamMembers.push(member);
        existingTeamMembers.sort();
        allMemberInput.value = null;
        displayTeams();
    }
}

function removeTeamMember(teamName, teamMember) {
    var teamMembers = globalState.teams.get(teamName);
    if (teamMembers.includes(teamMember)) {
        teamMembers.splice(teamMembers.indexOf(teamMember), 1);
        displayTeams();
    }
}