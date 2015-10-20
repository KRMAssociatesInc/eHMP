define([
    'backbone',
    'marionette',
    'underscore',
], function(Backbone, Marionette, _) {


    var Columns = [{
        name: 'goal',
        label: 'Goal',
        cell: 'string',
        groupable: false,
        hoverTip: 'patient_generated_goal'
    }, {
        name: 'currentProgress',
        label: 'Progress',
        cell: 'string',
        groupable: false,
        hoverTip: 'patient_generated_progress'
    }, {
        name: 'endDate',
        label: 'Goal End Date',
        cell: 'string',
        groupable: false,
        hoverTip: 'patient_generated_end'
    }, {
        name: 'nextDue',
        label: 'Next Due Goal',
        cell: 'string',
        groupable: false,
        hoverTip: 'patient_generated_next'
    }, {
        name: 'steps',
        label: 'Steps',
        cell: 'string',
        groupable: false,
        hoverTip: 'patient_generated_steps'
    }, {
        name: 'type',
        label: 'Type',
        cell: 'string',
        groupable: true,
        renderable: false,
        groupableOptions: {
            primary: true, //When a column is marked primary, when the grid is loaded, refreshed, or on the '3rd click', the grid is grouped by this column
            innerSort: "type", //this is reverse chronological (desc) order.
            groupByFunction: function(collectionElement) {
                return collectionElement.model.get("type");
            }
        },
        hoverTip: 'patient_generated_type'
    }];

    var fetchOptions = {
        resourceTitle: 'patient-entered-goals',
        pageable: false,
        cache: true,
        criteria: {}
    };
    fetchOptions.viewModel = {
        parse: function(response) {
            return response;
        }
    };

    var AppletGridView = ADK.AppletViews.GridView.extend({
        // use super to reference ADK.GridViews's methods
        _super: ADK.AppletViews.GridView.prototype,
        initialize: function(options) {
            var self = this;
            this.appletOptions = {
                columns: Columns,
                groupable: true,
                collection: ADK.PatientRecordService.fetchCollection(fetchOptions),
                filterFields: ['goal', 'type'],
                filterDateRangeField: {
                    name: "observedDate",
                    label: "Date",
                    format: "YYYYMMDD"
                }
            };

            // this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
            //     self.dateRangeRefresh('endDate');
            // });

            // calling ADK.GridView's initialize method
            this._super.initialize.apply(this, arguments);
        },
        onRender: function() {
            //if (DEBUG) console.log("PEG -----> onRender");
            this._super.onRender.apply(this, arguments);
        }
    });

    var applet = {
        id: "patient_entered_goals",
        viewTypes: [{
            type: 'summary',
            view: AppletGridView,
            chromeEnabled: true
        }],
        defaultViewType: 'summary'
    };

    return applet;
});