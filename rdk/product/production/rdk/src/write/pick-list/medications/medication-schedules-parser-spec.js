'use strict';

var log = sinon.stub(require('bunyan').createLogger({ name: 'outpatient-medication-schedules-fetch-list' }));
//var log = require('bunyan').createLogger({ name: 'outpatient-medication-schedules-fetch-list' }); //Uncomment this line (and comment above) to see output in IntelliJ console

var parseRpc = require('./medication-schedules-parser').parseMedicationSchedules;

var message2parse = '3ID^^C^08-16-24\r\n3XW^^C^10\r\n5XD^^C^02-07-12-17-22\r\n';

var expectedResult = '[{"scheduleName":"3ID","outpatientExpansion":"","scheduleType":"C","administrationTime":"08-16-24"},{"scheduleName":"3XW","outpatientExpansion":"","scheduleType":"C","administrationTime":"10"},{"scheduleName":"5XD","outpatientExpansion":"","scheduleType":"C","administrationTime":"02-07-12-17-22"}]';

describe('unit test to validate outpatient-medication-schedules parse the RPC response correctly', function() {
    it('parse the RPC data correctly', function () {
        var result = parseRpc(log, message2parse);
        result = JSON.stringify(result);
        expect(result).to.equal(expectedResult);
    });
});
