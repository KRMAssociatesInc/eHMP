define([
    'backbone',
    'marionette',
    'underscore',
    'jquery',
    'hbs!app/applets/vitalsEiE/templates/vitalsEiEBodyTemplate',
    'app/applets/vitalsEiE/views/vitalsEiEHeaderView',
    'app/applets/vitalsEiE/views/vitalsEiEFooterView'
], function(Backbone, Marionette, _, $, vitalsEiEBodyTemplate, vitalsEiEHeaderView, vitalsEiEFooterView) {

    var vitals_eie_el = '#vitals-entered-in-error';
    var vitals_eie_reason_el = '#vitals-reason-for-removal';
    var VITALS_TITLE = 'Vitals Entered in Error';
    var VITALS_EIE_MISSING_LOCALID = 'Your checked item has no id related to mark as entered in error.';
    var VITALS_EIE_NO_VITALS_CHECKED = 'You must check a vital in order to mark it in error.';
    var VITALS_EIE_NO_REASON_GIVEN = 'You must give a reason in order to mark a vital in error.';

    var gridView = {};

    /**
     * Marnionette View for Vitals that are Entered in Error
     * @extends {Backbone.Marionette.ItemView}
     */
    var vitalsEiEBodyView = Backbone.Marionette.ItemView.extend({
        template: vitalsEiEBodyTemplate,
        /**
         * @param {Object} options - optional items passed into the application constructor
         * @return {undefined}
         */
        initialize: function() {
            this.model = new Backbone.Model({
                'models': []
            });
        },

        onRender: function() {
            setTimeout(function() {
                $('[data-toggle="tooltip"]').tooltip({'placement': 'right'});
            }, 100);
        },

        'events': {
            'click input': 'validate',
            'blur input': 'validate'
        },
        /**
         * Called by a Backbone.Radio event in order to configure and show the modal
         * @param  {jQuery.Event} event - this is a passed in jQuery event
         * @param  {Objects} options - an object of other objects
         * @return {undefined}
         */
        showModal: function(event, options) {
            this.model.set('models', options.collection);
            var siteCode = ADK.UserService.getUserSession().get('site');
            _.each(this.model.get('models'), function(amodel) {
                pidSiteCode = amodel.get('pid') ? amodel.get('pid').split(';')[0] : '';
                if (!amodel.get('localId')){
                    amodel.set('localId', amodel.get('displayName') + '-no-local-id');
                }
                if (!amodel.get('enteredByName')){
                    amodel.attributes.enteredByName = "Unavailable";
                }
                if (pidSiteCode !== siteCode) {
                    //amodel.attributes.disabled = "disabled=disabled";
                    amodel.attributes.disabled = 'true';
                    amodel.attributes.labelClass = "grayText";
                    if (amodel.get('displayName') === 'BMI'){
                        amodel.attributes.tooltip = amodel.get('typeName') + ' ' +'disabled for edit.<br>Calculated value.';
                    } else if (!pidSiteCode){
                        amodel.attributes.tooltip = amodel.get('typeName') + ' ' +'disabled for edit.';
                    }
                    else {
                        amodel.attributes.tooltip = amodel.get('typeName') + ' ' +'disabled for edit.<br>Non-local site.';
                    }
                } else {
                    amodel.attributes.tooltip = amodel.get('typeName') + ' ' +amodel.get('resultUnits');
                    amodel.attributes.disabled = 'false';
                }
            });

            var footerView = vitalsEiEFooterView.extend({
                model: this.model.set(options.collection),
                bodyView: this
            });

            var headerView = vitalsEiEHeaderView.extend({
                model: this.model.set('title', options.title),
                theView: this
            });

            var modalOptions = {
                'size': 'large',
                'title': VITALS_TITLE,
                'headerView': headerView,
                'footerView': footerView,
                'regionName': 'vitalsEiEDialog'
            };

            ADK.showWorkflowItem(this, modalOptions);


            if (!_.isEmpty(options.checked)) {
                //if ($('input#' + options.checked).attr('aria-disabled') === 'false'){
                    $('input#' + options.checked).prop('checked', true);
                //}
            }
        },

        templateHelpers: {
            otherSite: function() {
               return true;
            }
        },
        /**
         * Function to check and create a list of errors
         * @param  {jQuery.Event} e - an event
         * @return {undefined}
         */
        validate: function(e) {
            var radio = $(e.target);
            //if (radio.attr('aria-disabled') === 'true'){
            //   radio.prop('checked', false);
            //   return;
            //}
            var errors = [];
            var valide = false;
            var hasCheckboxChecked = false;
            var hasRadioChecked = false;
            //reset all the errors
            this.resetErrors();

            // At least one checkbox should be checked
            var $checkboxes = $('input[type=checkbox]', this.$el);
            _.each($checkboxes, function(checkbox) {
                var $checkbox = $(checkbox);
                if ($checkbox.prop('checked') === true) {
                    hasCheckboxChecked = true;
                    if (_.isEmpty($checkbox.prop('id')) === true) {
                        errors.push({
                            'el': vitals_eie_el,
                            'message': VITALS_EIE_MISSING_LOCALID
                        });
                    }
                }
            });

            // A radio should be checked
            var $radios = $('input[type=radio]', this.$el);
            _.each($radios, function(radio) {
                if ($(radio).prop('checked') === true) {
                    hasRadioChecked = true;
                }
            });

            if (hasCheckboxChecked === false) {
                errors.push({
                    'el': vitals_eie_el,
                    'message': VITALS_EIE_NO_VITALS_CHECKED
                });
            }

            if (hasRadioChecked === false) {
                errors.push({
                    'el': vitals_eie_reason_el,
                    'message': VITALS_EIE_NO_REASON_GIVEN
                });
            }

            valid = _.isEmpty(errors);

            this.disableSave(!valid);

            if (valid === false) {
                //show errors
                this.displayErrors(errors);
            }
        },
        /**
         * Triggers the Backbone.Radio event that states whether or not vitalsEiE validated
         * @param  {boolean} valid - wether or not the validation was valid
         * @return {undefined}
         */
        disableSave: function(valid) {
            var vitalsEiE = ADK.Messaging.getChannel('vitalsEiE');
            vitalsEiE.command('vitalsEiE:validated', valid);
        },
        /**
         * Resets the error-messages
         * @return {undefined}
         */
        resetErrors: function() {
            var $vitalsErrors = $('.vitals-error');

            _.each($vitalsErrors, function(error) {
                var $error = $(error);
                $error.find('.error-message').remove();
                $error.removeClass('vitals-error applet-error');
            });
        },
        /**
         * Displays the error-messages
         * @param  {Array} errors - an array of error objects
         * @return {undefined}
         */
        displayErrors: function(errors) {
            _.each(errors, function(error) {
                var $item = $(error.el);
                $item.addClass('vitals-error');
                $item.prop('aria-inavalid', true);
                $item.prepend('<p class=\'error-message applet-error\' aria-atomic=\'true\' tab-index=\'0\'>' + error.message + '</p>');
            });
        }
    });

    return vitalsEiEBodyView;

});
