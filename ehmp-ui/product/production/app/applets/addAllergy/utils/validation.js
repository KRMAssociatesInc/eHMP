define([
    "underscore",
    "moment"
], function(_, Moment) {
    'use strict';

    return {
        initializeValidation: function() {
            this.on('change', this.validateModel);
        },
        defaultValidationMessages: {
            required: 'Required Field.',
            error: 'Error.'
        },
        //Backbone sets calls validate before it actually sets values.  If false nothing gets set.
        //This causes problems and was clearly meant for use where validate happens before a save, not a set.
        //To get around this we aren't listening to the invalid event and we have our own model validation
        //that can occur on set without causing problems.
        validateModel: function(model) {
            if (this.validation === undefined) {
                return;
            }
            this.hideClientErrors();
            this.errors = [];
            var self = this,
                attrs = model.attributes;

            _.each(Object.getOwnPropertyNames(this.validation), function(vRef) {
                var vObj,
                    fn,
                    attr,
                    attrName,
                    required,
                    reqFn,
                    ref,
                    selector;

                if (!vRef) return; //no validation found for object
                vObj = self.validation[vRef];

                attr = vRef.split(".");
                attrName = attr[attr.length - 1];

                if (typeof vObj === 'undefined') return;
                fn = self.validation[vRef].fn;
                required = vObj.required || false;
                reqFn = required.fn || function(ref, self) {
                    if (required) return (ref) ? true : false;
                    return true;
                };

                ref = vRef.split(".").reduce(function(o, x) {
                    o = o || {};
                    return o[x];
                }, attrs);

                if (typeof vObj.selector === 'function') {
                    selector = vObj.selector(self) || '#' + attrName;
                } else {
                    selector = vObj.selector || '#' + attrName;
                }

                if (fn && typeof fn === 'function') {
                    if (!fn(ref, self)) {
                        self.errors.push({
                            name: attrName,
                            message: vObj.message || self.defaultValidationMessages.error,
                            selector: selector
                        });
                    }
                }

                if (typeof reqFn === 'function' && !reqFn(ref, self)) {
                    self.errors.push({
                        name: attrName,
                        message: (typeof required.message === 'undefined') ? self.defaultValidationMessages.required : required.message,
                        selector: selector
                    });
                }
            });
            console.log("Client Validation");
            console.log(self.errors);
            this.showClientErrors();
        },
        isValid: function() {
            if (typeof this.errors === 'undefined') {
                this.errors = [];
            }
            return (this.errors.length > 0) ? false : true;
        },
        showClientErrors: function() {
            _.each(this.errors, function(error) {
                var controlGroup = $(error.selector);
                controlGroup.addClass('error');
                controlGroup.attr('aria-invalid', true);
                controlGroup.parent().find('.help-inline').text(error.message);
            }, this);
        },
        hideClientErrors: function() {
            _.each(this.errors, function(error) {
                var controlGroup = $(error.selector);
                controlGroup.removeClass('error');
                controlGroup.attr('aria-invalid', false);
                controlGroup.parent().find('.help-inline').text('');
            }, this);
        }
    };

});
