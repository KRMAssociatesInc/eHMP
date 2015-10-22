'use strict';
var utils = require('./utils');

describe('Utils testing', function() {
    var dataInput1 = {
        data: {
            updated: new Date(),
            totalItems: 2,
            items: [{
                uid: '1'
            }, {
                uid: '2'
            }]
        }
    };
    var dataInput2 = {
        data: {
            updated: new Date(),
            totalItems: 3,
            items: [{
                uid: '3'
            }, {
                uid: '4'
            }, {
                uid: '5'
            }]
        }
    };
    var collectionName = 'testCollection';
    var dataOutput1 = {
        testCollection: [{
            uid: '1'
        }, {
            uid: '2'
        }]
    };
    var dataArrInput = [dataInput1, dataInput2];
    var dataArrOutput = {
        testCollection: [{
            uid: '1'
        }, {
            uid: '2'
        }, {
            uid: '3'
        }, {
            uid: '4'
        }, {
            uid: '5'
        }]
    };

    it('verifies that given a jds query result object and a collectionName, the buildResult function returns the appropriate result', function() {
        expect(utils.buildResult(dataInput1, collectionName)).to.eql(dataOutput1);
    });
    it('verifies that given an array of jds query result objects and a collectionName, the buildResult function returns the appropriate result', function() {
        expect(utils.buildResult(dataArrInput, collectionName)).to.eql(dataArrOutput);
    });

});
