const globalState = {
    bills: new Map(),
    members: new Map(),
    scoreMappings: new Map(),
    // ex: globalState.scoreMappings.set("school", {sponsorScore: 1000, cosponsorScore: 999});
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