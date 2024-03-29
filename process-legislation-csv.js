setDate();

document.getElementById('datePicker').onblur = function() {
    if (getInputtedDate().getTime() == globalState.minimumDate.getTime()) {
        return;
    }
    setDate();
    calculateAndDisplayScores();
};

document.getElementById('datePicker').onkeydown = function(key) {
    if (key.key == "Enter") {
        if (getInputtedDate().getTime() == globalState.minimumDate.getTime()) {
            return;
        }
        setDate();
        calculateAndDisplayScores();
    }
};

function setDate() {
    globalState.minimumDate = getInputtedDate();
}

function getInputtedDate() {
    return new Date(Date.parse(document.getElementById('datePicker').value));
}

document.getElementById('legislativeCsv').onchange = function() {
    clearErrorMessages();
    var fileReader = new FileReader()
    fileReader.onload = function() {
        processFile(this.result);
        hideSpinner();
    };
    fileReader.readAsText(this.files[0]);
    showSpinner();
};

function processFile(fileText) {
    var fileLines = fileText.split(/\r?\n/);
    var headerIndex = getHeaderIndex(fileLines);
    if (headerIndex == null) {
        return;
    }
    
    var indices = getIndices(fileLines, headerIndex);
    if (indices == null) {
        return;
    }

    readRows(fileLines, headerIndex, indices);
    setMembersDataList();
    calculateAndDisplayScores();
}

function getHeaderIndex(fileLines) {
    var headerIndex = 0;
    while (headerIndex < fileLines.length && !fileLines[headerIndex].includes(latestActionColumnName)) {
        headerIndex++;
    }

    if (fileLines.length > headerIndex && fileLines[headerIndex].includes(latestActionColumnName)) {
        return headerIndex;
    }

    appendErrorMessage("File was readable, but no CSV header with \"Latest Action\" was found")
    return null;
}

function getIndices(fileLines, headerIndex) {
    var indices = {};
    var errorOccurred = false;

    var headerLine = splitColumns(fileLines[headerIndex]);
    for (columnIndex in nonCosponsorColumnNames) {
        var index = headerLine.indexOf(nonCosponsorColumnNames[columnIndex]);
        if (index == -1) {
            appendErrorMessage(nonCosponsorColumnNames[columnIndex] + " was not included in the list of header columns.")
            errorOccurred = true
        } else {
            indices[nonCosponsorColumnNames[columnIndex]] = index;
        }
    }

    var firstCosponsorIndex = headerLine.indexOf(cosponsorColumnName);
    var lastCosponsorIndex = headerLine.lastIndexOf(cosponsorColumnName);
    if (firstCosponsorIndex == -1 || lastCosponsorIndex == -1 || firstCosponsorIndex > lastCosponsorIndex) {
        appendErrorMessage(
            "Failed to find a reasonable range of " + cosponsorColumnName +
             " column indices. First at " + firstCosponsorIndex + ", last at " + lastCosponsorIndex);
        errorOccurred = true;
    }
    indices[cosponsorColumnName] = {first: firstCosponsorIndex, last: lastCosponsorIndex};
    indices[totalLength] = headerLine.length;
    
    if (errorOccurred) {
        return null;
    }
    return indices;
}

function readRows(fileLines, headerIndex, indices) {
    for (lineIndex in fileLines) {
        if (lineIndex > headerIndex) {
            readRow(fileLines[lineIndex], lineIndex, indices);
        }
    }
}

function readRow(line, currentIndex, indices) {
    if (line == "") {
        return;
    }

    var columns = splitColumns(line);
    
    if (columns.length != indices[totalLength]) {
        appendErrorMessage("Malformed row, line number " + currentIndex + ":\n" + line);
        return;
    }

    var bill = {};

    bill.legislationNumber = columns[indices[legislationNumberColumnName]];
    bill.title = columns[indices[titleColumnName]];
    bill.titleLowerCase = bill.title.toLowerCase();
    bill.latestAction = columns[indices[latestActionColumnName]];
    bill.latestActionDate = new Date(Date.parse(columns[indices[latestActionDateColumnName]]));
    bill.introductionDate = new Date(Date.parse(columns[indices[introductionDateColumnName]]));

    var sponsor = columns[indices[sponsorColumnName]];
    if (sponsor == "") {
        console.log("Empty string sponsor on line: " + line);
        return;
    }
    bill.sponsor = sponsor;
    bill.sponsorParty = getSponsorParty(sponsor);

    bill.cosponsorsByParty = new Map();
    var currentCosponsorIndex = indices[cosponsorColumnName].first
    var lastCosponsorIndex = indices[cosponsorColumnName].last
    while (currentCosponsorIndex <= lastCosponsorIndex && columns[currentCosponsorIndex] != "") {
        var cosponsor = columns[currentCosponsorIndex];
        if (cosponsor == "") {
            console.log("Empty string cosponsor on line: " + line);
        }
        var cosponsorParty = getSponsorParty(cosponsor);

        if (bill.cosponsorsByParty.get(cosponsorParty) == null) {
            bill.cosponsorsByParty.set(cosponsorParty, []);
        }
        bill.cosponsorsByParty.get(cosponsorParty).push(cosponsor);

        currentCosponsorIndex++;
    }

    if (globalState.bills.get(bill.legislationNumber) == null
        // If the bill already exists, pick whichever has the newest introductionDate.
        || globalState.bills.get(bill.legislationNumber).introductionDate < bill.introductionDate) {
        globalState.bills.set(bill.legislationNumber, bill);
    }

    addMemberToGlobalStateIfNew(sponsor);
    globalState.members.get(sponsor).sponsoredLegislationNumbers.add(bill.legislationNumber);

    for ([party, members] of bill.cosponsorsByParty) {
        for (member in members) {
            addMemberToGlobalStateIfNew(cosponsor);
            globalState.members.get(cosponsor).cosponsoredLegislationNumbers.add(bill.legislationNumber);
        }
    }
}

function addMemberToGlobalStateIfNew(memberName) {
    if (globalState.members.get(memberName) == null) {
        var newMember = {};
        newMember.name = memberName;
        newMember.sponsoredLegislationNumbers = new Set();
        newMember.cosponsoredLegislationNumbers = new Set();
        globalState.members.set(memberName, newMember);
    }
}

function setMembersDataList() {
    var allMemberDataList = document.getElementById('allMemberDataList');
    for ([member, _] of globalState.members) {
        var option = document.createElement('option');
        option.value = member;
        allMemberDataList.appendChild(option);
    }
}

function calculateAndDisplayScores() {
    calculateScores();
    displayScores();
    displayTeams();
}

function calculateScores() {
    for ([_, bill] of globalState.bills) {
        if (!isBillInDateRange(bill)) {
            bill.sponsorScore = 0;
            bill.cosponsorScore = 0;
        } else {
            bill.sponsorScore = defaultSponsorScore;
            bill.cosponsorScore = defaultCosponsorScore;
            globalState.scoreMappings.forEach((mapping) => {
                if (bill.titleLowerCase.includes(mapping.phrase)) {
                    bill.sponsorScore += mapping.sponsorScore;
                    bill.cosponsorScore += mapping.cosponsorScore;
                }
            });
        }
    }

    for ([_, member] of globalState.members) {
        member.sponsorScore = 0
        member.cosponsorScore = 0
        member.sponsoredLegislationNumbers.forEach((legislationNumber) => {
            if (isBillInDateRange(globalState.bills.get(legislationNumber))) {
                member.sponsorScore += globalState.bills.get(legislationNumber).sponsorScore;
            }
        });
        member.cosponsoredLegislationNumbers.forEach((legislationNumber) => {
            if (isBillInDateRange(globalState.bills.get(legislationNumber))) {
                member.cosponsorScore += globalState.bills.get(legislationNumber).cosponsorScore;
            }
        });
    }
}

function displayScores() {
    var members = Array.from(globalState.members.values());
    members.sort(compareMembers);
    var membersTextArea = document.getElementById("memberesText");
    membersTextArea.value = "";
    members.forEach((member) => {
        var score = member.sponsorScore + member.cosponsorScore;
        membersTextArea.value += member.name + " scored " + score + "\n";
    });

    var bills = Array.from(globalState.bills.values());
    bills.sort(compareBills);
    var billsTextArea = document.getElementById("billsText");
    billsTextArea.value = "";
    bills.forEach((bill) => {
        if (isBillInDateRange(bill)) {
            billsTextArea.value += bill.legislationNumber + ": Sponsor party: " + bill.sponsorParty 
                + getBillCosponsorsByPartyString(bill) + "\n";
        }
    });
}

function getBillCosponsorsByPartyString(bill) {
    var resultArray = [];
    for ([party, cosponsorList] of bill.cosponsorsByParty) {
        resultArray.push(", Cosponsor party: " + party + " count: " + cosponsorList.length);
    }
    // Sort to ensure that the party list is always in the same order.
    return resultArray.sort().join("");
}

function getBillTotalCosponsorCount(bill) {
    var count = 0;
    for ([_, cosponsorList] of bill.cosponsorsByParty) {
        count += cosponsorList.length;
    }
    return count;
}

function isBillInDateRange(bill) {
    return bill.introductionDate.getTime() >= globalState.minimumDate.getTime();
}

function compareMembers(member1, member2) {
    return member2.sponsorScore + member2.cosponsorScore - (member1.sponsorScore + member1.cosponsorScore);
}

function compareBills(bill1, bill2) {
    return getBillTotalCosponsorCount(bill2) - getBillTotalCosponsorCount(bill1);
}

function clearErrorMessages() {
    var parent = document.getElementById("errorMessages");
    removeAllChildren(parent);
}

function appendErrorMessage(message) {
    var paragraph = document.createElement('li');
    paragraph.innerText = message;
    document.getElementById("errorMessages").appendChild(paragraph);
}

function splitColumns(line) {
    // https://stackoverflow.com/a/23582323
    return line.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
}

// Take a string formatted like:
// Tokuda, Jill N. [Rep.-D-HI-2]
// Norton, Eleanor Holmes [Del.-D-DC-At Large]
// and find the substring which contains party info
function getSponsorParty(sponsor) {
    var firstBracketIndex = sponsor.indexOf("[");
    sponsor = sponsor.substring(firstBracketIndex);
    var firstDash = sponsor.indexOf("-");
    if (firstDash == -1) {
        return null;
    }

    return sponsor.charAt(firstDash + 1);
}