'use strict';

var resource = require('./orders-lab-vista-writer');

describe('write-back orders lab vista writer', function() {
    it('tests that getParameters returns correct parameters array', function() {
        var model = {
            "dfn": "100615",
            "provider": "10000000231",
            "location": "285",
            "orderDialog": "LR OTHER LAB TESTS",
            "displayGroup": "6",
            "quickOrderDialog": "2",
            "orderId": "38479;1",
            "inputList": [{
                "inputKey": "4",
                "inputValue": "350"
            }, {
                "inputKey": "126",
                "inputValue": "1"
            }, {
                "inputKey": "127",
                "inputValue": "72"
            }, {
                "inputKey": "180",
                "inputValue": "2"
            }, {
                "inputKey": "28",
                "inputValue": "SP"
            }, {
                "inputKey": "6",
                "inputValue": "TODAY"
            }, {
                "inputKey": "29",
                "inputValue": "28"
            }],
            "orderCheckList": [{
                "orderCheck": "NEW^11^2^Duplicate order: 11-DEOXYCORTISOL BLOOD   SERUM SP *UNSIGNED*  [UNRELEASED]"
            }],
            "localId": "12519",
            "uid": "urn:va:order:9E7A:100615:12519",
            "kind": "Laboratory"
        };
        var expectedArray = ['100615', '10000000231', '285', 'LR OTHER LAB TESTS', '6', '2', '38479;1', {
                '4,1': '350',
                '126,1': '1',
                '127,1': '72',
                '180,1': '2',
                '28,1': 'SP',
                '6,1': 'TODAY',
                '29,1': '28',
                '"ORCHECK"': '1',
                '"ORCHECK","NEW","2","01"': '11^2^Duplicate order: 11-DEOXYCORTISOL BLOOD   SERUM SP *UNSIGNED*  [UNRELEASED]',
                '"ORTS"': '0'
            },
            '', '', '', '0'
        ];
        var parameters = resource._getParameters(model);
        expect(parameters).to.eql(expectedArray);
    });

    it('tests that getParameters returns correct parameters array with comments', function() {
        var model = {
            "dfn": "100615",
            "provider": "10000000238",
            "location": "285",
            "orderDialog": "LR OTHER LAB TESTS",
            "displayGroup": "5",
            "quickOrderDialog": "2",
            "inputList": [{
                "inputKey": "4",
                "inputValue": "1191"
            }, {
                "inputKey": "126",
                "inputValue": "1"
            }, {
                "inputKey": "127",
                "inputValue": "72"
            }, {
                "inputKey": "180",
                "inputValue": "9"
            }, {
                "inputKey": "28",
                "inputValue": "SP"
            }, {
                "inputKey": "6",
                "inputValue": "TODAY"
            }, {
                "inputKey": "29",
                "inputValue": "28"
            }],
            "commentList": [
                {
                    "comment": "~For Test: AMIKACIN"
                },
                {
                    "comment": "~Dose is expected to be at &UNKNOWN level."
                },
                {
                    "comment": "additional comment"
                }
            ],
            "kind": "Laboratory"
        };
        var expectedArray = ['100615', '10000000238', '285', 'LR OTHER LAB TESTS', '5', '2', '', {
            '4,1': '1191',
            '126,1': '1',
            '127,1': '72',
            '180,1': '9',
            '28,1': 'SP',
            '6,1': 'TODAY',
            '29,1': '28',
            '15,1': 'ORDIALOG("WP",15,1)',
            '"WP",15,1,1,0': '~For Test: AMIKACIN',
            '"WP",15,1,2,0': '~Dose is expected to be at &UNKNOWN level.',
            '"WP",15,1,3,0': 'additional comment',
            '"ORCHECK"': '0',
            '"ORTS"': '0'
        },
            '', '', '', '0'
        ];
        var parameters = resource._getParameters(model);
        expect(parameters).to.eql(expectedArray);
    });
});
