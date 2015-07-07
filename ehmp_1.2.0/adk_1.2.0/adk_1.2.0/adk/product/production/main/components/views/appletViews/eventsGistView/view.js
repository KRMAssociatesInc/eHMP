define([
    'jquery',
    'underscore',
    'main/components/applets/baseDisplayApplet/view',
    'main/components/views/appletViews/eventsGistView/views/eventsGistView'
], function($, _, BaseDisplayApplet, EventsView) {
    'use strict';

    // this.appletOptions = {
    //      gistModel               : array of objects with attributes id and field (ie. [{id: 'name', field: 'summary'}])
    //      collectionParser        : a function that returns a manipulated/parsed collection
    //      gistHeaders             : object of column attributes
    //      filterFields
    //      filterDateRangeField
    //      collection
    //      onClickAdd              : method
    //
    //      refresh                 : method (optional overwrite)
    //      appletConfig            : {id, instanceId, fullscreen}
    // }

    var baseDisplayApplet = BaseDisplayApplet;

    var EventsGistView = BaseDisplayApplet.extend({
        initialize: function(options) {
            this._base = baseDisplayApplet.prototype;
            if (!this.options.appletConfig) {
                this.options.appletConfig = {};
                this.options.appletConfig.id = this.appletOptions.appletConfig.id;
                this.options.appletConfig.instanceId = this.appletOptions.appletConfig.instanceId;
                this.options.appletConfig.fullScreen = false;
                this.appletConfig = this.options.appletConfig;
            }

            var appletOptions = this.appletOptions || {}; //Set in extending view
            this.appletOptions = appletOptions;
            this.appletOptions.appletConfig = this.options.appletConfig;

            this.appletOptions.AppletView = EventsView.getView();
            this._base.initialize.apply(this, arguments);
        },
        events: {
            'click tr.selectable': 'onClickRow'
        },
        onClickRow: function(event) {
            var row = $(event.target).closest("tr");
            var model = row.data('model');
            if (this.options.onClickRow) {
                this.options.onClickRow(model, event, this);
            } else if (this.options.DetailsView) {
                this.expandRow(model, event);
            }
        }
    });

    return EventsGistView;
});
