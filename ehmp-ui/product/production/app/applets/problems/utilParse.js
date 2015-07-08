define([
    'backbone',
    'marionette',
    'underscore',
    'moment'
], function(Backbone, Marionette, _, moment) {
    'use strict';
    var Util = {};

    Util.parseExposure = function(exposureArray) {
        var expStr = '';
        exposureArray.forEach(function(exp) {
            var arr = exp.uid.split(':');
            if (arr[3] == 'Y') {
                if (expStr !== '') {
                    expStr += '; ';
                }
                expStr += arr[2];
            }
        });
        if (!expStr || expStr.trim() === '') {
            expStr = 'No exposures';
        }

        return expStr;
    };

    Util.toTitleCase = function(str) {
        if (!str) {
            return '';
        } else {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    };

    Util.getStandardizedDescription = function(response) {
        if (response.codes) {
            response.codes.forEach(function(code) {
                if (code.system.indexOf('http://snomed.info/sct') != -1) {
                    response.standardizedDescription = code.display;
                    response.snomedCode = code.code;
                }
            });
        }
        return response;
    };

    Util.getStatusName = function(response) {
        if (response.statusName) {
            response.statusName = this.toTitleCase(response.statusName);
        }
        return response;
    };

    Util.getServiceConnected = function(response) {
        if (response.serviceConnected !== undefined) {
            if (response.serviceConnected === true) {
                response.serviceConnectedDisp = 'Yes';
            } else {
                response.serviceConnectedDisp = 'No';
            }
        } else {
            response.serviceConnectedDisp = '';
        }
        return response;
    };

    Util.getProblemText = function(response) {
        if (response.problemText) {
            var icd9Index = response.problemText.indexOf('(ICD-9');            
            if (icd9Index > 0) {
                response.problemText = response.problemText.substring(0, icd9Index).trim();
            } 
            var sctIndex = response.problemText.indexOf('(SCT');
            if (sctIndex > 0) {
                response.problemText = response.problemText.substring(0, sctIndex).trim();
            }
        }
        return response;
    };

    Util.getICDCode = function(response) {
        if (response.icdCode) {
            response.icdCode = response.icdCode.replace('urn:icd:', '');
        }
        return response;
    };

    Util.getICDName = function(response) {
        if (response.icdName) {
            response.icdName = response.icdName;
        } else {
            response.icdName = response.problemText;
        }
        return response;
    };

    Util.getProblemGroupByData = function(response) {
        var groupbyValue;
        var groupbyField;

        if (response.get('standardizedDescription')) {
            groupbyField = 'standardizedDescription';
            groupbyValue = response.get(groupbyField);
        } else {
            //get the first word from 'name' with no commas or spaces
            groupbyField = 'problemText';
            groupbyValue = response.get(groupbyField);
            // groupbyValue = groupbyValue.split(" ")[0].toUpperCase();
        }

        return {
            groupbyValue: groupbyValue,
            groupbyField: groupbyField
        };
    };

    Util.getAcuityName = function(response) {
        if (response.acuityName) {
            response.acuityName = this.toTitleCase(response.acuityName);
            if (response.acuityName == 'Chronic') {
                response.chronic = true;
            } else if (response.acuityName == 'Moderate') {
                response.moderate = true;
            }
        } else {
            response.acuityName = 'Unknown';
        }
        return response;
    };

    Util.getFacilityColor = function(response) {

        if (response.facilityCode && response.facilityCode == 'DOD') {
            response.facilityColor = 'DOD';
        } else {
            response.facilityColor = 'nonDOD';
        }

        return response;
    };

    Util.getCommentBubble = function(response) {

        if (response.comments && response.comments.length > 0) {
            response.commentBubble = true;
        }

        return response;
    };

    Util.sortDate = function(a, b) {
        var c = new Date(a.dateTime);
        var d = new Date(b.dateTime);
        return (c - d) * -1;
    };

    Util.sortData = function(property) {
        property.problemGroup.get("allGroupedEncounters").sort(function(a, b) {
            return Util.sortDate(a, b);
        });
    };

    Util.compare = function(a, b) {
        return a - b;
    };

    Util.getTimeSince = function(response) {

        var startDate;
        if (response.encounters) {
            response.encounters.sort(function(a, b) {
                return Util.sortDate(a, b);
            });
            startDate = response.encounters[0].dateTime;
        } else {
            startDate = response.entered || response.updated;
        }

        var st = ADK.utils.getTimeSince(startDate);
        response.timeSince = st.timeSince;
        response.timeSinceText = st.timeSinceDescription;
        response.timeSinceDateString = startDate;
        response.timeSinceDate = moment(startDate, "YYYYMMDD");

        return response;
    };

    return Util;
});
