define([
    "moment",
    "app/applets/activeMeds/appConfig"
], function(Moment, CONFIG) {
    'use strict';
    var DEBUG = CONFIG.debug;
    var DEFAULT_TIME_FORMAT = CONFIG.defaultTimeFormat;

    var appHelper = {
        getDaysToExpiration: function(expirationDateStr) {

            var expirationDate = moment(expirationDateStr, 'YYYYMMDDHHmmssSSS');
            var today = moment();
            var duration = moment.duration(expirationDate.diff(today));
            var days = Math.round(parseFloat(duration.asDays()));

            return days;

        },
        getCalculatedEffectiveFillsRemaining: function(expirationDateStr, daysSupplyForEachFill, fillsRemaining, status) {
            var daysToExpiration = this.getDaysToExpiration(expirationDateStr);
            if (daysToExpiration <= 0 || fillsRemaining === 0 || status.toUpperCase() === 'EXPIRED' || status.toUpperCase() === 'DISCONTINUED' || status.toUpperCase() === 'CANCELLED') {
                return 0;
            } else {
                var estimatedFillsRemaining = parseFloat(daysToExpiration / daysSupplyForEachFill);
                estimatedFillsRemaining = Math.floor(estimatedFillsRemaining); //round down to account for just starting a fill
                if(fillsRemaining < estimatedFillsRemaining){
                    estimatedFillsRemaining = fillsRemaining;
                }
                return estimatedFillsRemaining;
            }
        }
    };
    return appHelper;
});
