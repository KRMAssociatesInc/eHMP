define([
    'underscore',
    'jquery',
    'hbs!app/applets/vitalsEiE/templates/vitalsEiEFooterTemplate'
], function(_, $, vitalsEiEFooterTemplate) {

    var vitals_eie_error_messages_el = '#vitalsEiE-error-messages';
    var VITALS_EIE_NO_REASON = 'You must give a reason in order to mark a vital in error.';
    var VITALS_EIE_NO_PATIENT_ID = 'The patient id could not be identified for deleting the specified vital.';

    /**
     * Object to hold the initialized instance in order to call functions on it and change or set it's model fields
     * @type {Object}
     */
    var view = {};

    /**
     * Marnionette View for Vitals that are Entered in Error
     * @extends {Backbone.Marionette.ItemView}
     */
    var eieFooterView = Backbone.Marionette.ItemView.extend({
        /**
         * @param {Object} options - optional items passed into the application constructor
         * @return {undefined}
         */
        initialize: function() {
            view = this;
            this.model.set('isDisabled', true);

            var vitalsEiE = ADK.Messaging.getChannel('vitalsEiE');
            vitalsEiE.comply('vitalsEiE:validated', function(args) {
                view.setDisabled(args);
            });
        },
        'template': vitalsEiEFooterTemplate,
        'events': {
            'click #vitals-EiE-submit': 'save'
        },
        'modelEvents': {
            'change:isDisabled': 'disabledChanged'
        },
        /**
         * Rerenders the view if isDisabled is changed on the model
         * @return {undefined}
         */
        disabledChanged: function() {
            this.render();
        },
        /**
         * Function to save the data
         * @param  {jQuery.Event} e - the jquery event
         * @return {undefined}
         */
        save: function(e) {
            e.preventDefault();
            view.showLoadingTextOnButton(e, true);

            var errors = [];
            var $reason = $('input[name=\'reason\']:checked').val();
            var models = this.model.get('models');
            var patient = ADK.PatientRecordService.getCurrentPatient();
            var user = ADK.UserService.getUserSession();
            var pid = patient.get('icn') || patient.get('pid') || patient.get('id');
            var resourceUrl = ADK.ResourceService.buildUrl('write-back-vitals-error', {
                pid: pid
            });

            var deferredList = [];

            view.resetErrors();

            if (_.isEmpty($reason) === false) {
                if (_.isEmpty(pid) === false) {
                    // loop over all models and check if they are checked
                    models.forEach(function(model) {
                        //new deffered object
                        var $deferred = $.Deferred();
                        var id = model.get('localId');
                        var uid = model.get('uid');
                        var dataObj = JSON.stringify({
                            'isRemove' : true,
                            'ien': id,
                            'reason': $reason,
                            'pid': pid
                        });

                        if (id) {
                            // check if the checkbox was checked
                            var $el = $('#' + id);
                            if ($el.prop('checked') === true) {
                                deferredList.push($deferred);

                                model.id = 'destroy';
                                model.url = resourceUrl;
                                model.save(null, {
                                    data: dataObj,
                                    contentType: 'application/json',
                                    success: function(model, response) {
                                        $deferred.resolve(response);
                                    },
                                    error: function(model, response) {
                                        //flag error
                                        $deferred.resolve(response);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    error.push({
                        'el': vitals_eie_error_messages_el,
                        'message': VITALS_EIE_NO_PATIENT_ID
                    });
                }
            } else {
                error.push({
                    'el': vitals_eie_error_messages_el,
                    'message': VITALS_EIE_NO_REASON
                });
            }

            //DONT fail or reject any of the above $deferred or this when will resolve immediately
            $.when.apply($, deferredList).then(function(args) {
                //parse the args and make sure all the responses were good
                //if not display an error that some data was unable to be
                //marked in error
                view.showLoadingTextOnButton(e, false);
                if (errors.length <= 0) {
                    //set the button back and flag error
                    ADK.hideModal();
                    //refresh gridview that was passed in from the extend on the bodyView
                    setTimeout(function() {
                          ADK.Messaging.getChannel('vitals').request('refreshGridView');
                    }, 2000);
                    //ADK.Messaging.getChannel('vitals').request('refreshGridView');
                } else {
                    //show error about something not being deleted
                    //show regular text on the button and disable it by rerendering it
                    view.setDisabled('true');
                    view.displayErrors(errors);
                }
            });

        },
        /**
         * Simply sets the isDisabled field on the model
         * @param {Boolean} isDisabled
         */
        setDisabled: function(isDisabled) {
            view.model.set('isDisabled', isDisabled);
        },
        /**
         * Show or hide the loading text on the "save" button
         * @param  {jQuery.Event} e     - a jquery event
         * @param  {Boolean} loading    - wether we are processing or not
         * @return {undefined}
         */
        showLoadingTextOnButton: function(e, loading) {
            var $element = $(e.currentTarget);
            var text = 'button-text';
            var disabled = false;
            $element.prop('aria-atomic', false);
            if (loading) {
                text = 'loading-text';
                disabled = true;
                $element.prop('aria-atomic', true);
            }
            $element.prop('disabled', disabled);
            var $text = $element.data(text);
            $element.html($text);
        },
        /**
         * Resets the Error Messages
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
         * Displays the Error objects in the errors array
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
    view = eieFooterView;

    return eieFooterView;
});
