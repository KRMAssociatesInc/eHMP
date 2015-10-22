'use strict';

var saveVistaWriter = require('../lab/orders-lab-vista-writer');
var discontinueVistaWriter = require('./orders-common-discontinue-vista-writer');

var discontinueWritebackContext = {
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
        'provider': '10000000238',
        'location': '285',
        'kind': 'Laboratory'
    }
};

var saveWritebackContext = {
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
        'dfn': '100615',
        'provider': '10000000238',
        'location': '285',
        'orderDialog': 'LR OTHER LAB TESTS',
        'displayGroup': '5',
        'quickOrderDialog': '2',
        'inputList': [
            {
                'inputKey': '4',
                'inputValue': '350'
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
        'localId': '12519',
        'uid': 'urn:va:order:9E7A:100615:12519',
        'kind': 'Laboratory'
    }
};

describe('write-back orders common discontinue vista writer integration tests', function() {

    //Test w/o required orderId
    it('tests that discontinue order returns error with no vprResponse & no vprModel', function(done) {
        this.timeout(5000);
        discontinueVistaWriter(discontinueWritebackContext, function(err, result) {
            expect(err).to.be.truthy();
            expect(discontinueWritebackContext.vprResponse).to.be.undefined();
            expect(discontinueWritebackContext.vprModel).to.be.undefined();
            done();
        });
    });

/*
    //This test will create a new lab order in Vista.  Uncomment to test locally
    it('tests that discontinue order returns successful vprResponse & vprModel', function(done) {
        this.timeout(10000);
        saveVistaWriter.create(saveWritebackContext, function(err, result) {
            expect(err).to.be.falsy();
            expect(saveWritebackContext.vprResponse).to.be.truthy();
            var resultArray = ('' + saveWritebackContext.vprResponse).split('^');
            var orderId = resultArray[0].substring(1, resultArray[0].length);
            console.log('===== order ID: '+ orderId);
            discontinueWritebackContext.model.orderId = orderId;
            discontinueVistaWriter(discontinueWritebackContext, function(err, result) {
                expect(err).to.be.falsy();
                expect(discontinueWritebackContext.vprResponse).to.be.truthy();
                expect(discontinueWritebackContext.vprModel).to.be.truthy();
                done();
            });
        });
    });
*/

});
