'use strict';
var rdk = require('../../../core/rdk');
var _ = rdk.utils.underscore;
var nullchecker = rdk.utils.nullchecker;
var jdsFilter = require('jds-filter');
var moment = require('moment');
var querystring = require('querystring');
var utils = require('./utils');

/*
This section contains a list of completed VA Outpatient Encounters for the patient and a list of Discharge Summaries for the patient.
The data comes from all VA treatment facilities.

- Outpatient Encounters:
  The list of VA Outpatient Encounters shows the 25 most recent Encounter dates within the last 36 months.
  Each VA Outpatient Encounter may also include several notes with the complete note text.
  There is a limit of 10 notes for each Encounter.
  Follow-up visits related to the VA Encounter are not included.

- Discharge Summaries:
  The list of Discharge Summaries includes the 10 most recent discharges in the last 36 monthes.
  The data comes from all VA treatment facilities.
*/

var collections = {
    outpatient_encounters: {
        name: 'visit',
        domain: 'encounter',
        filter: function(date) {
            var refDate = moment(date).subtract(36, 'months');
            var filterList = [
                ['ne', 'removed', 'true'],
                ['between', 'dateTime', refDate.format('YYYYMMDD'), moment(date).format('YYYYMMDD')],
                ['eq', 'categoryCode', 'urn:va:encounter-category:OV']
            ];
            var jdsQuery = {
                //start: 0,
                limit: 25,
                order: 'dateTime DESC',
                filter: jdsFilter.build(filterList)
            };
            return querystring.stringify(jdsQuery);
        }
    },
    discharge_summaries: {
        name: 'document',
        filter: function(date) {
            var refDate = moment(date).subtract(36, 'months');
            var filterList = [
                ['ne', 'removed', 'true'],
                ['between', 'entered', refDate.format('YYYYMMDD'), moment(date).format('YYYYMMDD')],
                ['eq', 'documentTypeCode', 'DS']
            ];
            var jdsQuery = {
                //start: 0,
                limit: 10,
                order: 'entered DESC',
                filter: jdsFilter.build(filterList)
            };
            //return 'limit=10&order=entered%20DESC&filter=and(gt(entered,"'+refDate.format('YYYYMMDD')+'"),eq(documentTypeCode,DS))';
            return querystring.stringify(jdsQuery);
        }
    },
    encounter_notes: {
        name: 'document',
        filter: function(date, visitsList) {
            var filterByEncounter = [];
            if (nullchecker.isNotNullish(visitsList) && nullchecker.isNotNullish(visitsList.outpatient_encounters) && nullchecker.isNotNullish(visitsList.outpatient_encounters.visit) && nullchecker.isNotNullish(visitsList.outpatient_encounters.visit.items)) {
                filterByEncounter = _.map(visitsList.outpatient_encounters.visit.items, function(item) {
                    var filterList = [
                        ['ne', 'removed', 'true'],
                        ['eq', 'encounterUid', item.uid],
                        ['eq', 'status', 'COMPLETED'],
                        ['ilike', 'kind', '%note%']
                    ];
                    var jdsQuery = {
                        //start: 0,
                        limit: 10,
                        order: 'entered DESC',
                        filter: jdsFilter.build(filterList)
                    };
                    return querystring.stringify(jdsQuery);
                });
            }

            return filterByEncounter;
        },
        dependsOn: ['outpatient_encounters']
    }
};

function getData(req, pid, refferenceDate, callback) {
    utils.getData(collections, req, pid, refferenceDate, callback);
}
module.exports.getData = getData;
