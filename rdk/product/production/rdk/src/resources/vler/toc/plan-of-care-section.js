'use strict';
var rdk = require('../../../core/rdk');
//var _ = rdk.utils.underscore;
//var nullchecker = rdk.utils.nullchecker;
var jdsFilter = require('jds-filter');
var moment = require('moment');
var querystring = require('querystring');
var utils = require('./utils');

/*
This section contains future care activities for the patient from all VA treatment facilities.
Plan of Care includes future appointments, future surgery procedures, future radiology exams,  future orders and wellness reminders.

- Future Appointments:
  This section displays appointments scheduled in the next 12 months up to a maximum of 50 appointments.
  Patients may have recurring appointments, with multiple instances of the same appointment.
  Not all appointments are documented based upon variability in workflows from facility to facility.
  As a result, all future appointments may not be included.

- Future Surgical Procedures:
  This section displays scheduled surgeries in the next 12 months.
  It includes only major surgical procedures, up to a maximum of 50 procedures are included.

- Future Radiology Procedures:
  This section displays scheduled radiology procedures in the next 12 months, up to a maximum of 50 procedures are included.

- Future Wellness Reminders:
  This section displays Wellness Reminders based on the recommendations of the U.S. Preventive Services Task Force (USPSTF).
  The recommendation may be listed multiple times based on the same patient data satisfying the guideline being available at different VA facilities.
  These recommendations are not a comprehensive set.
  Absence of a reminder from this dynamic list does not necessarily indicate that the patient does not require it.
  Clinicians should use their own judgment.
  A maximum of 50 reminders will be displayed.

- Future Scheduled Tests:
  This section displays orders scheduled in the next 12 months, up to a maximum of 50.
*/

var collections = {
    future_appointments: {
        name: 'appointment',
        domain: 'encounter',
        filter: function(date) {
            var refDate = moment(date).add(12, 'months');
            var filterList = [
                ['ne', 'removed', 'true'],
                ['between', 'dateTime', moment(date).format('YYYYMMDD'), refDate.format('YYYYMMDD')]
            ];
            var jdsQuery = {
                //start: 0,
                limit: 50,
                order: 'dateTime ASC',
                filter: jdsFilter.build(filterList)
            };
            return querystring.stringify(jdsQuery);
        }
    },
    future_surgical_procedures: {
        name: 'surgery',
        domain: 'procedure',
        filter: function(date) {
            var refDate = moment(date).add(12, 'months');
            var filterList = [
                ['ne', 'removed', 'true'],
                ['between', 'dateTime', moment(date).format('YYYYMMDD'), refDate.format('YYYYMMDD')]
            ];
            var jdsQuery = {
                //start: 0,
                limit: 50,
                order: 'dateTime ASC',
                filter: jdsFilter.build(filterList)
            };
            return querystring.stringify(jdsQuery);
        }
    },
    future_radiology_procedures: {
        name: 'rad',
        domain: 'imaging',
        queryByDomain: true,
        filter: function(date) {
            var refDate = moment(date).add(12, 'months');
            var filterList = [
                ['ne', 'removed', 'true'],
                ['between', 'dateTime', moment(date).format('YYYYMMDD'), refDate.format('YYYYMMDD')]
            ];
            var jdsQuery = {
                //start: 0,
                limit: 50,
                order: 'dateTime ASC',
                filter: jdsFilter.build(filterList)
            };
            return querystring.stringify(jdsQuery);
        }
    },
    future_scheduled_tests: {
        name: 'order',
        filter: function(date) {
            var refDate = moment(date).add(12, 'months');
            var filterList = [
                ['ne', 'removed', 'true'],
                ['between', 'entered', moment(date).format('YYYYMMDD'), refDate.format('YYYYMMDD')]
            ];
            var jdsQuery = {
                //start: 0,
                limit: 50,
                order: 'entered ASC',
                filter: jdsFilter.build(filterList)
            };
            return querystring.stringify(jdsQuery);
        }
    },
};

function getData(req, pid, refferenceDate, callback) {
    utils.getData(collections, req, pid, refferenceDate, callback);
}
module.exports.getData = getData;
