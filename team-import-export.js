document.getElementById('loadTeamsButton').onchange = function() {
    var fileReader = new FileReader();
    fileReader.onload = function() {
        processTeamsFile(this.result);
    };
    fileReader.readAsText(this.files[0]);
};


document.getElementById('saveTeamsButton').onclick = function(key) {
    saveTeams();
};

function processTeamsFile(fileText) {
    let parsed = JSON.parse(fileText);

    globalState.teams = new Map();
    for (let teamName in parsed.teams) {
        if (parsed.teams.hasOwnProperty(teamName)) {
            globalState.teams.set(teamName, parsed.teams[teamName]);
        }
    }
    
    globalState.scoreMappings = parsed.scoreMappings;

    displayScoreMappings();
    displayTeams();
}

async function saveTeams() {
    // JSON Stringify doesn't handle ES6 maps, so convert it to an object first.
    const teamsAsObject = {};
    for (const [teamName, teamMembers] of globalState.teams) {
        teamsAsObject[teamName] = teamMembers;
    }

    let saveState = {
        scoreMappings: globalState.scoreMappings,
        teams: teamsAsObject
    }

    let serializedSaveState = JSON.stringify(saveState);
    
    const handle = await window.showSaveFilePicker({
        suggestedName: "teams.json",
        types: [
          {
            description: "JSON Files",
            accept: {
              "application/json": [".json"],
            },
          },
        ],
    });

    const writable = await handle.createWritable();
    await writable.write(serializedSaveState);
    await writable.close();
}