'use strict';

var getCommonOrderTasks = require('./orders-common-tasks');

describe('write-back orders common tasks', function() {
    it('tests that getCommonOrderTasks returns defined tasks', function() {
        var commonOrderTasks = getCommonOrderTasks('discontinue', {});
        expect(commonOrderTasks).not.to.be.undefined();
    });

    it('tests that getCommonOrderTasks returns undefined tasks', function() {
        var undefinedTasks = getCommonOrderTasks('surf', {});
        expect(undefinedTasks).to.be.undefined();
    });
});
