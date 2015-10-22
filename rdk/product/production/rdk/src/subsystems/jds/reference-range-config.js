'use strict';

function getReferenceRanges() {
    //the attributes have to match the typeName
    var referenceRanges = {
        'blood pressure': {
            low: '90/140',
            high: '60/90',
            override: false
        },
        'pulse oximetry': {
            low: '95',
            high: '100',
            override: true
        },
        'pain': {
            low: '0',
            high: '2',
            override: false
        },
        'bmi': {
            low: '18.5',
            high: '25',
            override: false
        },
        'pulse': {
            low: '60',
            high: '100',
            override: false
        },
        'respiration': {
            low: '12',
            high: '20',
            override: false
        }
    };
    return referenceRanges;
}

module.exports.getReferenceRanges = getReferenceRanges;
