'use strict';

require('../env-setup');

var _ = require('underscore');
var request = require('request');

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

describe('end-to-end', function() {
    it('works', function() {
        var synced = false,
            finished = false,
            completedStamp;
        runs(function() {
            request({
                'url': 'http://' + vx_sync_ip + ':8080/sync/doLoad?pid=9E7A;3'
            }, function() {
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        });

        var checkStatus = function() {
            request({
                'url': 'http://' + vx_sync_ip + ':8080/sync/status?pid=9E7A;3'
            }, function(error, response, body) {
                body = JSON.parse(body);

                if (!_.isUndefined(body.syncStatus.completedStamp) && _.isUndefined(body.syncStatus.inProgress)) {
                    synced = true;
                    console.log('===== Sync Completed =====');
                    console.log(body.syncStatus.completedStamp);
                    expect(body.syncStatus.completedStamp).not.toBeUndefined();
                    completedStamp = body;
                    return;
                } else if (!_.isUndefined(body.syncStatus.inProgress)) {
                    console.log('===== Waiting on Metastamp =====');
                    console.log(body.syncStatus.inProgress);
                } else {
                    console.log('===== No Metastamp Received =====');
                    console.log(body);
                }

                console.log('===== Sync Not Complete.  Waiting... =====');
                setTimeout(checkStatus, 10000);
            });
        };

        runs(checkStatus);

        waitsFor(function() {
            return synced;
        }, 120000);

        runs(function() {
            expect(true).toBe(true);
            expect(completedStamp).not.toBeUndefined();

            // Run all the real tests here.

            expect(completedStamp.syncStatus).not.toBeUndefined();
            expect(completedStamp.syncStatus.completedStamp).not.toBeUndefined();

            var completedMetaStamp = completedStamp.syncStatus.completedStamp;

            expect(completedMetaStamp.sourceMetaStamp).not.toBeUndefined();

            expect(completedMetaStamp.sourceMetaStamp['9E7A']).not.toBeUndefined();
            expect(completedMetaStamp.sourceMetaStamp.DOD).not.toBeUndefined();
        });
    });
});