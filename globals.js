const globalState = {
    bills: new Map(),
    members: new Map(),
    // ex: globalState.scoreMappings.push({phrase: "school", sponsorScore: 1000, cosponsorScore: 999});
    scoreMappings: [],
    teams: new Map(),
    lastSpinnerIndex: -1,
}

const latestActionColumnName = "\"Latest Action\"";
const latestActionDateColumnName = "\"Latest Action Date\"";
const sponsorColumnName = "Sponsor";
const legislationNumberColumnName = "\"Legislation Number\"";
const titleColumnName = "Title";
const introductionDateColumnName = "\"Date of Introduction\"";

const nonCosponsorColumnNames = [
    latestActionColumnName,
    latestActionDateColumnName,
    sponsorColumnName,
    legislationNumberColumnName,
    titleColumnName,
    introductionDateColumnName
];

const cosponsorColumnName = "Cosponsor";

const totalLength = "totalLength";

const defaultSponsorScore = 1;
const defaultCosponsorScore = 1;