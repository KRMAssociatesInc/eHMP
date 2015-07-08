define([
    "moment",
    "app/applets/immunizations/appConfig"
], function(Moment, CONFIG) {
    'use strict';
    var DEBUG = CONFIG.debug;

    var appHelper = {
        isReaction: function(reaction) {
            if (reaction) {
                if ((reaction.toLowerCase() === "no") || (reaction.toLowerCase() === "none"))
                    return "No";
            }
            return (reaction ? "Yes" : "No");
        },
        seriesNormalization: function(series) {
            if (series == '0') {
                return "";
            } else {
                return series;
            }
        },
        setTimeSince: function(fromDate) {

            var ageData = ADK.utils.getTimeSince(fromDate);
            return ageData.timeSince;
        }



        // end of appHelpers
    };
    return appHelper;
});
