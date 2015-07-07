define([
    'backbone',
    'marionette',
    'underscore'
], function(Backbone, Marionette, _) {
    'use strict';
    var Util = {};
  
    Util.getModalTitle = function(model) {
        return 'CCD Document - ' + model.get('name');
    };

    return Util;
});
