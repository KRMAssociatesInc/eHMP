'use strict';

var _ = require('lodash');
var moment = require('moment');

require('../../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var handler = require(global.OSYNC_HANDLERS + 'active-user/active-user');

describe('active user handler unit tests', function() {

    describe('process active users list unit test', function() {
        it('returns the list of pids', function() {
            var activeUsersList = [{
                'accessCode': 'user1',
                'lastlogin': 'doesntmatter',
                'patientList': [{
                    'pid': 'patient1',
                    'data': 'some data',
                    'information': 'some more data'
                 }, {
                     'pid': 'patient2',
                     'data': 'some different data',
                     'information': 'some more different data'
                 }]
            }, {
                'accessCode': 'user2',
                'lastlogin': 'dummyvalue',
                'patientList': [{
                    'pid': 'patient2',
                    'data': 'some different data',
                    'information': 'some more different data'
                }, {
                    'pid': 'patient3',
                    'data': 'some information',
                    'information': 'some more information'
                }]
            }];
            var expectedPidList = ['patient1', 'patient2', 'patient3'];

            handler.private_process(activeUsersList, function(result) {
                expect(_.size(result)).toBe(3);
                expect(result).toContain('patient1');
                expect(result).toContain('patient2');
                expect(result).toContain('patient3');
            });
        });
    });

    describe('filter for active users unit test', function() {
        it('returns the active users list', function() {
            var user1 = {
                'accessCode': 'user1',
                'lastlogin': '20150330',
                'patientList': [{
                    'pid': 'patient1',
                    'data': 'some data',
                    'information': 'some more data'
                 }, {
                     'pid': 'patient2',
                     'data': 'some different data',
                     'information': 'some more different data'
                 }]
            };
            var user2 = {
                'accessCode': 'user2',
                'lastlogin': '20140111',
                'patientList': [{
                    'pid': 'patient2',
                    'data': 'some different data',
                    'information': 'some more different data'
                }, {
                    'pid': 'patient3',
                    'data': 'some information',
                    'information': 'some more information'
                }]
            };
            var usersList = [user1, user2];

            var activeUsersList = handler.private_filterForActiveUsers(usersList, moment('2015-04-20'));
            expect(activeUsersList).toContain(user1);
            expect(activeUsersList).not.toContain(user2);

            activeUsersList = handler.private_filterForActiveUsers(usersList, moment('2014-01-11'));
            expect(activeUsersList).toContain(user1);
            expect(activeUsersList).toContain(user2);
        });
    });

    describe('fix date string format unit test', function() {
        it('returns a good date string', function() {
            var reformattedDate = handler.private_fixDateString('20121222');
            expect(reformattedDate).toBe('2012-12-22');
            expect(moment(reformattedDate).isValid()).toBe(true);
        });
    });

});
