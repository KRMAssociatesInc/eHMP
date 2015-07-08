define([
    "underscore",
    "moment",
    "app/applets/addAllergy/utils/validation",
    "app/applets/addAllergy/utils/symptomsUtil",
], function(_, Moment, Validation) {
    'use strict';

    var SymptomsModel = Backbone.Model
        .extend(Validation)
        .extend({
            initialize: function() {
                this.initializeValidation();
            },
            defaults: {
                'IEN': '',
                'name': '',
                'dateTime': ''
            },
            validation: {
                'symptomTime': {
                    message: 'Future time not allowed',
                    fn: function(value, model) {
                        if (!value) { //if it's required this will be picked up in that check
                            return true;
                        }
                        var symptomDate = new Moment(model.get('symptomDate') + ' ' + value + 'm');
                        if (symptomDate.isAfter(moment())) {
                            return false;
                        }
                        return true;
                    },
                    selector: function(model) {
                        var selector;
                        _.each(Object.getOwnPropertyNames(model.attributes), function(name) {
                            if (name.substring(0, 2) === 'tp') selector = name;
                        });
                        return '#' + selector;
                    }
                }
            }
        });

    return SymptomsModel;

});
