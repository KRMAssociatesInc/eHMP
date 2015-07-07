define([
    "underscore",
    "moment"
], function(_, Moment) {
    'use strict';

    return {
        initialize: function() {
            this.on('invalid', this.showClientErrors);
        },
        validation: {
            'param.ORDIALOG.startDate': {
                message: 'Please enter a valid date.',
                fn: function(value) {
                    var date = ADK.utils.formatDate(value, ADK.utils.dateUtils.defaultOptions().placeholder),
                        absoluteZeroDate = -5364662400000; //this is 1800-01-01 which is the oldest date the system can accept
                    if (date && Date.parse(date) < absoluteZeroDate) {
                        return false;
                    }
                    return true;
                }
            },
        },
        validate: function(attrs, options) {
            this.errors = [];
            var self = this;

            _.each(Object.getOwnPropertyNames(this.validation), function(vName) {
                var fn,
                    attr,
                    ref = vName.split(".").reduce(function(o, x) {
                        o = o || {};
                        return o[x];
                    }, attrs);
                fn = self.validation[vName].fn;
                if (fn && typeof fn === 'function') {
                    if (fn(ref)) {
                        return [];
                    }
                    attr = vName.split(".");
                    self.errors.push({
                        name: attr[attr.length - 1],
                        message: self.validation[vName].message
                    });
                }
            });

            return this.errors.length > 0 ? this.errors : false;
        },
        isValid: function() { //must be used after a set operation.  Model doesn't get updated when it flags as invalid.
            return (this.errors.length > 0) ? false : true;
        },
        showClientErrors: function() {
            _.each(this.errors, function(error) {
                var controlGroup = $('#' + error.name);
                controlGroup.addClass('error');
                controlGroup.parent().find('.help-inline').text(error.message);
            }, this);
        },
        hideClientErrors: function() {
            $('input').removeClass('error');
            $('.help-inline').text('');
        }
    };

});
