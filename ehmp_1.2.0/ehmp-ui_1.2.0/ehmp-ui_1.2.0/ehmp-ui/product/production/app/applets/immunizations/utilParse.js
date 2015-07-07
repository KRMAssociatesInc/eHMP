define([
    'backbone',
    'marionette',
    'underscore'
], function(Backbone, Marionette, _) {
    'use strict';
    var Util = {};

    Util.getContraindicated = function(response) {
        if (response.contraindicated) {   
          
            response.contraindicatedDisplay = 'Yes';
          
        } else {
          response.contraindicatedDisplay = 'No';
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

    Util.getStandardizedName = function(response) {
        response.standardizedName = '';
        if (response.codes) {
            response.codes.forEach(function(code) {
                if (code.system.indexOf('urn:oid:2.16.840.1.113883.12.292') != -1) {
                    response.standardizedName = code.display;
                }
            });
        }
        return response;
    };
    
    Util.getCommentBubble = function(response) {

        if (response.comment && response.comment.length > 0) {
            response.commentBubble = true;
        }

        return response;
    };

    return Util;
});
