/* jshint -W089 */
/* jshint -W083 */
'use strict';

var fhirUtils = require('./fhir-converter');

describe('Fhir Utils', function(test) {
    var inputValue = {
        '19940617': '1994-06-17',
        '199406171612': '1994-06-17T16:12:00',
        '19940617161233': '1994-06-17T16:12:33'
    };

    var systemDate = new Date(2014, 3, 13, 14, 59, 45, 30);

    it('verifies that given a valid date it returns a valid Fhir date', function() {
        var o = systemDate.getTimezoneOffset();
        var om = Math.abs(o) % 60;
        var oh = Math.floor(Math.abs(o) / 60);
        var resDate = '2014-03-13T14:59:45.030' + (o <= 0 ? '-' : '+') + (oh < 10 ? '0' : '') + oh + ':' + (om < 10 ? '0' : '') + om;
        expect(fhirUtils.convertToFhirDateTime(systemDate)).to.equal(resDate);
    });

    for (var dateInput in inputValue) {
        it('verifies that given a valid VPR date it converts to a valid Fhir date', function() {
            expect(fhirUtils.convertToFhirDateTime(dateInput)).to.equal(inputValue[dateInput]);
        });
    }

    it('verifies that the function removes div tag from text', function() {
        var divText = '<div>This is awesome!</div>';
        expect(fhirUtils.removeDivFromText(divText)).to.equal('This is awesome!');
    });

    var extensions = [{
        'url': 'http://acme.org/fhir/Profile/main#trial-status-code',
        'valueCode': 'unsure'
    }, {
        'url': 'http://acme.org/fhir/Profile/main#trial-status-date',
        'valueDate': '2009-03-14'
    }, {
        'url': 'http://acme.org/fhir/Profile/main#trial-status-who',
        'valueResource': {
            'reference': 'Practitioner/example'
        }
    }];

    var extension = {
        url: 'http://acme.org/fhir/Profile/main#trial-status-who',
        valueResource: {
            reference: 'Practitioner/example'
        }
    };

    it('verifies that given an extension it returns the URL from it', function() {
        expect(fhirUtils.findExtension(extensions, 'http://acme.org/fhir/Profile/main#trial-status-who')).to.eql(extension);
    });

    it('verifies that given an extension it returns the value from it', function() {
        expect(fhirUtils.getExtensionValue(extensions, 'http://acme.org/fhir/Profile/main#trial-status-who')).to.eql(extension.valueResource);
    });

    it('converts a Javascript Date object to HL7V2 (convertDateToHL7V2)', function() {
        var d = new Date('2015-06-03T13:21:58Z');
        expect(fhirUtils.convertDateToHL7V2(d, false)).to.equal('201506031321');
        expect(fhirUtils.convertDateToHL7V2(d, true)).to.equal('20150603132158');
    });
});
