define([
    'backbone',
    'marionette',
    'underscore'
], function(Backbone, Marionette, _) {
    'use strict';
    var Util = {};

    Util.getFacilityColor = function(response) {

        if (response.facilityCode && response.facilityCode == 'DOD') {
            response.facilityColor = 'DOD';
        } else {
            response.facilityColor = 'nonDOD';
        }

        return response;
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

    Util.getAcuityName = function(response) {
        response.acuityName = this.toTitleCase(response.acuityName);
        if (response.acuityName == 'Mild') {
            response.mild = true;
        } else if (response.acuityName == 'Moderate') {
            response.moderate = true;
        } else {
            response.severe = true;
        }
        return response;
    };

    Util.getSeverityCss = function(response) {
        if (response.acuityName) {
            response.severityCss = response.acuityName.toLowerCase();
        } else {
            response.severityCss = 'noSeverity';
        }
        return response;
    };

    Util.getReactions = function(response) {
        var result = '';
        if (response.reactions) {
            response.reactions.forEach(function(reac) {
                if (result !== '')
                    result += '; ';
                result += reac.name;
            });
        }
        response.reaction = result;
        return response;
    };

    Util.getDrugClasses = function(response) {
        var names = '';
        if (response.drugClasses) {
            response.drugClasses.forEach(function(drugClass) {
                if (names !== '') {
                    names += ', ';
                }
                names += drugClass.name;
            });
        }
        response.drugClassesNames = names;
        return response;
    };

    /*Util.getComments = function(response) {
        var comments = '';
        if (_.isArray(response.comments)) {
            response.comments.forEach(function(commentObj) {
                if (comments !== '') {
                    comments += ', ';
                }
                comments += commentObj.comment;
            });
        }
        response.comments = comments;
        return response;
    };*/

    Util.getStandardizedName = function(response) {
        response.standardizedName = '';
        if (response.codes) {
            response.codes.forEach(function(code) {
                if (code.system.indexOf('urn:oid:2.16.840.1.113883.6.86') != -1) {
                    response.standardizedName = code.display;
                }
            });
        }
        return response;
    };

    Util.getCommentBubble = function(response) {

        if (response.comments && response.comments.length > 0) {
            response.commentBubble = true;
        }

        return response;
    };

    return Util;
});
