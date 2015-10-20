define([
    'backbone',
    'marionette',
    'underscore'
], function(Backbone, Marionette, _) {
    'use strict';
    var Util = {};

    Util.toTitleCase = function(str) {
        if (!str) {
            return '';
        } else {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    };

    Util.getTypeName = function(response) {
        if (response.typeName) {
            if (response.typeName !== 'BMI') {
                response.typeName = Util.toTitleCase(response.typeName);
            }
        }

        return response;
    };

    Util.getFacilityColor = function(response) {

        if (response.facilityCode && response.facilityCode.toUpperCase() == 'DOD') {
            response.facilityColor = 'DOD';
        } else {
            response.facilityColor = 'nonDOD';
        }

        return response;
    };

    Util.getStandardizedName = function(response) {
        response.standardizedName = '';
        if (response.codes) {
            response.codes.forEach(function(code) {
                if (code.system.indexOf('http://loinc.org') != -1) {
                    response.standardizedName = code.display;
                }
            });
        }
        return response;
    };

    Util.noVitlasNoRecord = function(response) {
        var noVital = '';
        if (response.result == noVital) {
            response.result = "No record";
        }

        return response;
    };

    Util.getFormattedHeight = function(response) {
        //var formattedHeight = null;
        if (response.typeName && response.typeName.toLowerCase() == 'height') {
            if (!isNaN(response.result)) {
                if (response.units && response.units == 'cm') {
                    response.result = Math.round(response.result * 0.3937);
                    response.units = 'in';
                    //formattedHeight = response.result + ' ' + response.units;
                    //response.formattedHeight = formattedHeight;
                }
            }
        }

        return response;
    };
    Util.getResultUnits = function(response) {
        response.resultUnits = '';
        if (response.result) {
            response.resultUnits = response.result;
        }
        if (response.units && (response.result !== 'Pass' && response.result !== 'Refused' && response.result !== 'Unavailable')) {
            response.resultUnits += ' ' + response.units;
        }
        return response;
    };

    Util.getNumericTime = function(response) {
        if (response === undefined) return response;
        var str = response;
        var reg = /(\d+)/ig;
        var strReg = str.match(reg);
        str = str.substr(str.length - 1);
        switch (str) {
            case 'y':
                if (strReg == 1) {
                    str = 'year';
                } else str = 'years';
                break;

            case 'm':
                if (strReg == 1) {
                    str = 'month';
                } else str = 'months';
                break;

            case 'M':
                if (strReg == 1) {
                    str = 'month';
                } else str = 'months';
                break;

            case 'd':
                if (strReg == 1) {
                    str = 'day';
                } else str = 'days';
                break;

            case 'h':
                if (strReg == 1) {
                    str = 'hour';
                } else str = 'hours';
                break;
        }
        response = strReg + ' ' + str;
        return response;
    };

    Util.getMetricResult = function(response) {
        if(!response.metricUnits) {
            if(response.units === 'lb') {
                response.metricUnits = 'kg';
                response.metricResult = Math.round(response.result / 2.20462);
            } else if (response.units === 'in') {
                response.metricUnits = 'cm';
                response.metricResult = Math.round(response.result / 0.3937);
            } else if (response.units === 'F') {
                response.metricUnits = 'C';
                response.metricResult = Math.round(response.result / 1.8);
            }
        }
        return response;
    };

    Util.getMetricResultUnits = function(response) {
        response.metricResultUnits = '';
        if (response.metricResult) {
            response.metricResultUnits = response.metricResult;
        }
        if (response.metricUnits && (response.metricUnits !== 'Pass' && response.metricUnits !== 'Refused' && response.result !== 'Unavailable')) {
            response.metricResultUnits += ' ' + response.metricUnits;
        }
        return response;
    };

    Util.getResultUnitsMetricResultUnits = function(response) {
        response.resultUnitsMetricResultUnits = response.resultUnits;
        if(response.metricResultUnits){
            response.resultUnitsMetricResultUnits += ' / ' + response.metricResultUnits;
        }
        return response;
    };

    Util.getReferenceRange = function(response) {
        if (response.low) {
            response.referenceRange = response.low + ' - ' + response.high + ' ' + response.units;
        } else {
            response.referenceRange = null;
        }

        return response;
    };

    Util.getFormattedWeight = function(response) {
        var formattedWeight = null;
        if (response.typeName && response.typeName.toLowerCase().indexOf('weight') > -1) {
            if (response.units && response.units == 'kg') {
                response.metricResult=response.result;
                response.metricUnits=response.units;
                response.result = Math.round(response.result * 2.20462);
                response.units = 'lb';
                formattedWeight = response.result + ' ' + response.units;
                response.formattedWeight = formattedWeight;
            }
        }

        return response;
    };

    Util.getDisplayName = function(response) {
        if (!response.displayName) {
            response.displayName = '';
            if (response.typeName) {
                var type = response.typeName.toLowerCase();
                switch (type) {
                    case 'blood pressure':
                        response.displayName = 'BP';
                        break;
                    case 'pulse':
                        response.displayName = 'P';
                        break;
                    case 'respiration':
                        response.displayName = 'R';
                        break;
                    case 'temperature':
                        response.displayName = 'T';
                        break;
                    case 'pulse oximetry':
                        response.displayName = 'PO2';
                        break;
                    case 'pain':
                        response.displayName = 'PN';
                        break;
                    case 'weight':
                    case 'patient body weight - measured':
                        response.displayName = 'WT';
                        break;
                    case 'height':
                        response.displayName = 'HT';
                        break;
                    case 'body mass index':
                        response.displayName = 'BMI';
                        break;
                    case 'circumference/girth':
                        response.displayName = 'CG';
                        break;
                    default:
                        response.displayName = response.typeName;
                        //console.log(response.typeName);
                        break;
                }
            }
        }
        return response;
    };
    return Util;


});
