define([
    'backbone',
    'underscore'
], function(Backbone, _) {
    'use strict';
    var appletHelpers = {

        parseReportDetailResponse : function(response) {
            //response.siteName === undefined ? response.siteKey : response.siteName;
            return response;
        },
        getModalTitle : function(response) {
            return response.facilityMoniker + ' - ' + response.hsReport;
        }
    };

    return appletHelpers;
});
