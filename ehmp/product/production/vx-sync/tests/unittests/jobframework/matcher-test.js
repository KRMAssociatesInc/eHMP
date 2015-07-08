'use strict';

require('../../../env-setup');

var matcher = require(global.VX_JOBFRAMEWORK + 'matcher');

describe('findChildIdentifier.isChildIdentifierMatch', function() {
    it('return true when looking for an icn and icn is passed', function() {
        var requiredIdentifier = {
            type: 'icn'
        };
        var patientIdentifier = {
            type: 'icn',
            value: '123'
        };
        var result = matcher.isMatch(requiredIdentifier, patientIdentifier);
        expect(result).toBe(true);
    });
    it('return false when looking for an icn and dfn is passed', function() {
        var requiredIdentifier = {
            type: 'icn'
        };
        var patientIdentifier = {
            type: 'dfn',
            site: 'ABC',
            value: '123'
        };
        var result = matcher.isMatch(requiredIdentifier, patientIdentifier);
        expect(result).toBe(false);
    });
    it('return true when looking for an dfn/site and dfn/site is passed', function() {
        var requiredIdentifier = {
            type: 'dfn',
            site: 'ABC'
        };
        var patientIdentifier = {
            type: 'dfn',
            site: 'ABC',
            value: '123'
        };
        var result = matcher.isMatch(requiredIdentifier, patientIdentifier);
        expect(result).toBe(true);
    });
    it('return false when looking for an dfn/site and dfn / different site is passed', function() {
        var requiredIdentifier = {
            type: 'dfn',
            site: 'ABC'
        };
        var patientIdentifier = {
            type: 'dfn',
            site: 'BCD',
            value: '123'
        };
        var result = matcher.isMatch(requiredIdentifier, patientIdentifier);
        expect(result).toBe(false);
    });
    it('return false when looking for an dfn/site and icn is passed', function() {
        var requiredIdentifier = {
            type: 'dfn',
            site: 'ABC'
        };
        var patientIdentifier = {
            type: 'icn',
            value: '123'
        };
        var result = matcher.isMatch(requiredIdentifier, patientIdentifier);
        expect(result).toBe(false);
    });
    it('return false when empty require identifier is null', function() {
        var requiredIdentifier;
        var patientIdentifier = {
            type: 'icn',
            value: '123'
        };
        var result = matcher.isMatch(requiredIdentifier, patientIdentifier);
        expect(result).toBe(false);
    });
    it('return false when empty require identifier is empty', function() {
        var requiredIdentifier = {};
        var patientIdentifier = {
            type: 'icn',
            value: '123'
        };
        var result = matcher.isMatch(requiredIdentifier, patientIdentifier);
        expect(result).toBe(false);
    });
    it('handle patiet with missing value', function() {
        var requiredIdentifier = {
            type: 'dfn',
            site: 'ABC'
        };
        var patientIdentifier = {
            type: 'dfn',
            value: '123'
        };
        var result = matcher.isMatch(requiredIdentifier, patientIdentifier);
        expect(result).toBe(false);
    });
});

function createPatientIdentifierList() {
    return [{
        type: 'dfn',
        site: 'A',
        value: '123'
    }, {
        type: 'dfn',
        site: 'B',
        value: '456'
    }, {
        type: 'dfn',
        site: 'C',
        value: '789'
    }, {
        type: 'icn',
        value: '123V456'
    }, {
        type: 'EDIPI',
        value: 'x'
    }, {
        type: 'EDIPI',
        value: 'y'
    }];
}

describe('findChildIdentifier.findMatchingChildIdentifiers', function() {
    it('find icn in list', function() {
        var requiredIdentifier = {
            type: 'icn'
        };

        var result = matcher.findMatches(requiredIdentifier, createPatientIdentifierList());
        expect(result.length).toBe(1);
        expect(result[0].value).toBe('123V456');

    });
    it('find dfn in list', function() {
        var requiredIdentifier = {
            type: 'dfn',
            site: 'A'
        };

        var result = matcher.findMatches(requiredIdentifier, createPatientIdentifierList());
        expect(result.length).toBe(1);
        expect(result[0].value).toBe('123');
    });
    it('find multiple in list', function() {
        var requiredIdentifier = {
            type: 'EDIPI',
        };

        var result = matcher.findMatches(requiredIdentifier, createPatientIdentifierList());
        expect(result.length).toBe(2);

        // the order is arbitrary 
        expect(result[0].value).toBe('x');
        expect(result[1].value).toBe('y');
    });
    it('filter empty list', function() {
        var requiredIdentifier = {
            type: 'EDIPI',
        };

        var result = matcher.findMatches(requiredIdentifier, []);
        expect(result.length).toBe(0);
    });
    it('filter undefined list', function() {
        var requiredIdentifier = {
            type: 'EDIPI',
        };

        var result = matcher.findMatches(requiredIdentifier, undefined);
        expect(result.length).toBe(0);
    });

});