define([
    "backbone",
    "marionette",
    "hbs!app/applets/patient_search/templates/filter/filterPatientInputTemplate"
], function(Backbone, Marionette, filterPatientInputTemplate) {

    var ENTER_KEY = 13; // find a home for these

    var FilterInputView = Backbone.Marionette.ItemView.extend({
        template: filterPatientInputTemplate,
        events: {
            'keyup #patientFilterInput': 'updateFilterString',
            'keydown #patientFilterInput': 'updateFilterString',
            'keypress #patientFilterInput': 'updateFilterString'
        },
        onRender: function() {
            $(this.el).find(".input-group").focusin(function() {
                $(this).addClass("hasFocus");
            }).focusout(function() {
                $(this).removeClass("hasFocus");
            });
        },
        updateFilterString: function(event) {
            if (event.keyCode !== undefined && event.keyCode != ENTER_KEY) {
                return;
            }
            this.model.set({
                'filterString': $(event.currentTarget).val()
            });
        }
    });

    return FilterInputView;
});
