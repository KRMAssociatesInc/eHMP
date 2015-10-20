module.exports = {
    diagnoses: 'diagnoses',
    procedures: 'procedures',
    providers: 'providers',
    problems: 'problems',
    type: 'type',
};

module.exports.encounterDefaults = {
    kind: '',
    uid: '',
    encounterType: '',
    comment: '',
    typeDisplayName: '',
    service: ''
};

module.exports.procedureDefaults = {
    type: '',
    uid: '',
    name: '',
    comment: '',
    cptCode: '',
    quantity: ''
};

module.exports.problemDefaults = {
    icdCode: '',
    icdGroup: '',
    icdName: '',
    kind: '',
    problemText: '',
    providerName: '',
    providerUid: '',
    service: '',
    serviceConnected: '',
    summary: '',
    uid: '',
    comment: ''
};

module.exports.diagnosisDefaults = {
    icdCode: '',
    type: '',
    name: '',
    uid: '',
    comment: ''
};

module.exports.providerDefaults = {
    primary: false,
    providerDisplayName: '',
    providerName: '',
    role: ''
};
