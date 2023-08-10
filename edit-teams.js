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
        return;
    }

    if (globalState.teams.has(teamName)) {
        setTeamNameErrorMessage("Team already exists");
        return;
    } else {
        globalState.teams.set(teamName, []);
    }
    displayTeams();
}

function setTeamNameErrorMessage(message) {
    document.getElementById('teamNameErrorMessage').innerText = message;
}

function displayTeams() {
    var editParent = document.getElementById('editExistingTeamsDiv');
    removeAllChildren(editParent);

    var simpleTextArea = document.getElementById('simpleTeamInfo');
    simpleTextArea.value = "";

    var verboseTextArea = document.getElementById('verboseTeamInfo');
    verboseTextArea.value = "";

    for (let [teamName, teamMembers] of globalState.teams) {
        var teamDiv = document.createElement('div');
        teamDiv.className = "teamDiv";
        editParent.appendChild(teamDiv)
        
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

        let allMemberInput = document.createElement('input');
        allMemberInput.placeholder = "add member";
        allMemberInput.setAttribute("list", "allMemberDataList");
        allMemberInput.onkeydown = function(key) {
            // key.key is null when clicking per https://stackoverflow.com/a/65073572
            if (key.key == null || key.key == "Enter") {
                addTeamMember(teamName, allMemberInput);
            }
        }
        teamDiv.appendChild(allMemberInput);

        let addMemberButton = document.createElement('input');
        addMemberButton.type = "button";
        addMemberButton.className = "addMemberButton";
        addMemberButton.value = "Add member";
        addMemberButton.onclick = function() {
            addTeamMember(teamName, allMemberInput);
        }
        teamDiv.appendChild(addMemberButton);

        var teamScore = 0;

        var simpleMemberText = "";
        var verboseMemberText = "";

        teamMembers.forEach(teamMember => {            
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

            var member = globalState.members.get(teamMember)
            // Can happen on team import without having scores loaded
            if (member == null) {
                return;
            }

            var memberScore = member.sponsorScore + member.cosponsorScore;
            teamScore += memberScore;

            simpleMemberText += teamMember + " scored: " + memberScore + "\n";

            verboseMemberText += teamMember + " scored: " + memberScore + "\n";

            var sponsoredBillNumbers = member.sponsoredLegislationNumbers;
            if (sponsoredBillNumbers.size > 0) {
                verboseMemberText += "==Sponsored " + sponsoredBillNumbers.size + " bill==\n";
                for (billNumber of sponsoredBillNumbers) {
                    verboseMemberText += globalState.bills.get(billNumber).title + "\n";
                }
            }

            var cosponsoredBillNumbers = member.cosponsoredLegislationNumbers;
            if (cosponsoredBillNumbers.size > 0) {
                verboseMemberText += "==Cosponsored " + cosponsoredBillNumbers.size + " bills==\n";
                for (billNumber of cosponsoredBillNumbers) {
                    verboseMemberText += globalState.bills.get(billNumber).title + "\n";
                }
            }
        });

        simpleTextArea.value += "Team name: " + teamName + ", score: " + teamScore + "\n" + simpleMemberText + "\n";
        verboseTextArea.value += "Team name: " + teamName + ", score: " + teamScore + "\n" + verboseMemberText + "\n";
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