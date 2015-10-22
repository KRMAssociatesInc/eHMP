'use strict';
var rdk = require('../../../core/rdk');

var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
        },
        type: {
            required: false,
            description: 'all documents if not present. Discharge summary notes if equals to \'34745-0\'. For all others use \'34765-8\' '
        },
        start: {
            required: false,
            regex: /\d+/,
            description: 'start showing results from this 0-based index'
        },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        }
    }
};

var getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        interceptors: {
            synchronize: true
        },
        parameters: parameters,
        apiDocs: apiDocs,
        get: getPatientGoalsData,
        permissions: [],
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'authorization']
        }
    }];
};

var apiDocs = {
    spec: {
        path: '',
        nickname: 'patient-generated',
        summary: '',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            rdk.docs.swagger.paramTypes.query('type', 'type', 'string', true),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

function getPatientGoalsData(req, res, next) {

    var outJSON = [{
        'goal': 'Lose Weight',
        'currentProgress': 'active',
        'enteredDate': '05/11/2015',
        'endDate': '06/12/2015',
        'steps': '0/4',
        'nextDue': '06/03/2015',
        'type': 'Health'
    }, {
        'goal': 'Get a Raise',
        'currentProgress': 'active',
        'enteredDate': '05/12/2015',
        'endDate': '05/20/2015',
        'steps': '0/1',
        'nextDue': '05/02/2015',
        'type': 'Finance'
    }, {
        'goal': 'Concentration',
        'currentProgress': 'active',
        'enteredDate': '05/12/2015',
        'endDate': '05/29/2015',
        'steps': '0/1',
        'nextDue': '05/02/2015',
        'type': 'Work'
    }, {
        'goal': 'Vacation in Dubai',
        'currentProgress': 'active',
        'enteredDate': '06/12/2015',
        'endDate': '08/15/2015',
        'steps': '0/2',
        'nextDue': '07/12/2015',
        'type': 'Leisure'
    }, {
        'goal': 'Get Married',
        'currentProgress': 'complete',
        'enteredDate': '01/12/2015',
        'endDate': '03/20/2015',
        'steps': '3/3',
        //'nextDue':'06/06/2015',
        'type': 'Relationships'
    }, {
        'goal': 'Make more Friends',
        'currentProgress': 'active',
        'enteredDate': '01/01/2015',
        'endDate': '10/10/2015',
        'steps': '3/3',
        'nextDue':'06/06/2015',
        'type': 'Relationships'
    }, {
        'goal': 'Eat More Vegetables',
        'currentProgress': 'active',
        'enteredDate': '02/15/2015',
        'endDate': '07/07/2015',
        'steps': '2/4',
        'nextDue': '06/06/2015',
        'type': 'Health'
    }, {
        'goal': 'Less Junk Food',
        'currentProgress': 'active',
        'enteredDate': '03/01/2015',
        'endDate': '06/07/2015',
        'steps': '2/4',
        'nextDue': '06/06/2015',
        'type': 'Health'
    }];

    res.status(200).rdkSend(outJSON);
}

module.exports.getPatientGenatedData = getPatientGoalsData;
module.exports.getResourceConfig = getResourceConfig;
