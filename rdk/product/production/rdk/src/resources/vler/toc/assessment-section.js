'use strict';
var rdk = require('../../../core/rdk');
//var _ = rdk.utils.underscore;
//var nullchecker = rdk.utils.nullchecker;
var jdsFilter = require('jds-filter');
var moment = require('moment');
var querystring = require('querystring');
var utils = require('./utils');

/*
This section contains a list of assessments from completed VA Outpatient Encounters for the patient.
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
    }
};

function getData(req, pid, refferenceDate, callback) {
    utils.getData(collections, req, pid, refferenceDate, callback);
}
module.exports.getData = getData;
