//Allergies classes
'use strict';


function allergyFactory(objType, subType) {
    var obj = new AllergyObject();
    if (obj[objType]) {
        return obj[objType](subType);
    } else {
        return null;
    }
}

var AllergyObject = function() {

};

AllergyObject.prototype = {
    Substance: function() {
        return {
            resourceType: 'Substance',
            id: '',
            text: {
                status: '',
                div: ''
            },
            type: {
                coding: [],
                text: ''
            }
        };
    },


    Coding: function() {
        return {
            system: '',
            code: '',
            display: ''
        };
    },


    Exposure: function() {
        return {
            substance: {
                reference: ''
            }
        };
    },


    Practitioner: function() {
        return {
            resourceType: 'Practitioner',
            id: '',
            name: {
                text: ''
            },
            location: {
                identifier: {
                    label: '',
                    value: ''
                }
            }
        };
    },

    Patient: function() {
        return {
            resourceType: 'Patient',
            identifier: {
                label: ''
            }
        };
    },

    Extension: function(type) {
        var e = {
            url: ''
        };
        if (type === 'DateTime') {
            e.valueDateTime = '';
        } else {
            e.valueString = '';
        }
        return e;
    },



    Identifier: function() {
        return {
            use: 'official',
            system: 'urn:oid:2.16.840.1.113883.6.233',
            value: ''
        };
    },



    Reaction: function() {
        return {
            resourceType: 'AdverseReaction',
            extension: [],
            text: {
                status: '',
                div: '',
            },
            contained: [],
            identifier: [],
            date: '',
            subject: {},
            didNotOccurFlag: undefined,
            recorder: {},
            symptom: [],
            exposure: []
        };
    },



    Symptom: function() {
        return {
            code: {
                text: '',
                coding: ''
            },
            severity: ''

        };
    }
};



module.exports.allergyFactory = allergyFactory;
