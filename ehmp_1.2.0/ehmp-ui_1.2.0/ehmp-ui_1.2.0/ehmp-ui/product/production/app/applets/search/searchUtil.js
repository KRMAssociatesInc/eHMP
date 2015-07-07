define([
    "backbone",
    "marionette",
    "underscore",
    "moment"
], function(Backbone, Marionette, _, moment) {
//month and day are always two digits
//things are sequential so if no month, no day
    var searchUtil = {
        doDatetimeConversion: function(datetimeNum) {
            if(!_.isUndefined(datetimeNum)) {
                var frmt,parseFrmt,
                    dtLen = datetimeNum.length;
                switch(true) {
                    case (dtLen === 4):
                        parseFrmt = 'YYYY';
                        frmt = 'YYYY';
                        break;
                    case (dtLen < 8 && dtLen >= 6):
                        parseFrmt = 'YYYYMM';
                        frmt = 'MM/YYYY';
                        //if the day is wierd, default to the 15th
                        if(dtLen === 7) {
                            datetimeNum = datetimeNum.substring(0,(dtLen - 1)) + '15';
                            parseFrmt = 'YYYYMMDD';
                            frmt = 'MM/DD/YYYY';
                        }
                        break;
                    case (dtLen === 8):
                        parseFrmt = 'YYYYMMDD';
                        frmt = 'MM/DD/YYYY';
                        break;
                    case (dtLen >= 10):
                        parseFrmt = 'YYYYMMDDHHmm';
                        frmt = 'MM/DD/YYYY - HH:mm';
                        break;
                }
                if(moment(datetimeNum,parseFrmt).isValid()){
                    return moment(datetimeNum,parseFrmt).format(frmt);
                }
            }
            //return date as UNKOWN if year is invalid or undefined
            return "Unknown";
        }
    };
    return searchUtil;
});
