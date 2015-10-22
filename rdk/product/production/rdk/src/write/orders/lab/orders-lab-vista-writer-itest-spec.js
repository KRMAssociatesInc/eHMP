'use strict';

var vistaWriter = require('./orders-lab-vista-writer');

var writebackContext = {
    pid: '9E7A;100615',
    vistaConfig: {
        host: '10.2.2.101',
        port: 9210,
        accessCode: 'mx1234',
        verifyCode: 'mx1234!!',
        localIP: '10.2.2.1',
        localAddress: 'localhost'
    },
    model: {
        //'dfn': '100615',
        'provider': '10000000238',
        'location': '285',
        'orderDialog': 'LR OTHER LAB TESTS',
        'displayGroup': '5',
        'quickOrderDialog': '2',
        'inputList': [
            {
                'inputKey': '4',
                'inputValue': '1191'
            },
            {
                'inputKey': '126',
                'inputValue': '1'
            },
            {
                'inputKey': '127',
                'inputValue': '72'
            },
            {
                'inputKey': '180',
                'inputValue': '9'
            },
            {
                'inputKey': '28',
                'inputValue': 'SP'
            },
            {
                'inputKey': '6',
                'inputValue': 'TODAY'
            },
            {
                'inputKey': '29',
                'inputValue': '28'
            }
        ],
        'commentList': [
            {
                'comment': '~For Test: AMIKACIN'
            },
            {
                'comment': '~Dose is expected to be at &UNKNOWN level.'
            },
            {
                'comment': 'additional comment'
            }
        ],
        'kind': 'Laboratory'
    }
};

describe('write-back orders lab vista writer integration tests', function() {

    //Test w/o required DFN
    it('tests that save order returns error with no vprResponse & no vprModel', function(done) {
        this.timeout(5000);
        vistaWriter.create(writebackContext, function(err, result) {
            expect(err).to.be.truthy();
            expect(writebackContext.vprResponse).to.be.undefined();
            expect(writebackContext.vprModel).to.be.undefined();
            done();
        });
    });

/*
    //This test will create a new lab order in Vista.  Uncomment to test locally
    it('tests that save order returns successful vprResponse & vprModel', function(done) {
        writebackContext.model.dfn = '100615';  //set missing DFN
        this.timeout(5000);
        vistaWriter.create(writebackContext, function(err, result) {
            expect(err).to.be.falsy();
            expect(writebackContext.vprResponse).to.be.truthy();
            expect(writebackContext.vprModel).to.be.truthy();
            done();
        });
    });
*/

});
