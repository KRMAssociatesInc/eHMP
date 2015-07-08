define([
    'underscore',
    'jquery',
    'app/applets/vitals/applet',
    'hbs!app/applets/vitalsEiE/templates/vitalsEiEHeaderTemplate'
], function(_, $, vitals, vitalsEiEHeaderTemplate) {

    /**
     * Marnionette View for Vitals that are Entered in Error
     * @extends {Backbone.Marionette.ItemView}
     */
    var eieHeaderView = Backbone.Marionette.ItemView.extend({
        _this: this,
        'model': new Backbone.Model({}),
        'template': vitalsEiEHeaderTemplate,
        'modelEvents': {
            'change': 'fieldsChanged'
        },
        'events': {
            'click #changeObservation': 'changeObservation'
        },
        /**
         * Renders the view again when the model changes
         * @return {undefined}
         */
        fieldsChanged: function() {
            this.render();
        },
        initialize: function() {
            _this = this;
        },
        /**
         * Uses the Backbone.Radio to pass the gridView (for refreshing the coversheet grid) and
         * the event to show a List of Observation Dates
         * @param  {jQuery.Event} event - a jquery event
         * @return {undefined}
         */
        changeObservation: function(event) {
            var vitalsChangeObservationChannel = ADK.Messaging.getChannel('vitalsObservationList');
            vitalsChangeObservationChannel.trigger('vitalsObservationList:clicked', event);
        }
    });

    return eieHeaderView;

});
