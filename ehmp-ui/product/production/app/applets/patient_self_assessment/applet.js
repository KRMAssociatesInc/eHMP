define([
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'hbs!app/applets/patient_self_assessment/templates/typerow',
    'hbs!app/applets/patient_self_assessment/templates/row'
], function(Backbone, Marionette, _, Handlebars, typerowtemplate, rowtemplate) {

    Handlebars.registerHelper('ratingToStars', function(rating, maxrating) {return rating;});
    //Handlebars.registerHelper('ratingToStars', toStars);
        // function ratingToStars(rating, maxrating) {
    //     return rating;
    //     // var star = '<i class="fa fa-star"></i>';
    //     // var staro = '<i class="fa fa-star-o"></i>';
    //     // var ret = 'xxxxx';
    //     // for (var i = 0; i < maxrating + 1; i++) {
    //     //     ret += (i <= rating) ? star : staro;
    //     // }
    //     // return ret;
    // }
    var Columns = [{
            name: 'category', //should be 'type'
            label: '',
            cell: 'string',
            groupable: true,
            renderable: false,
            groupableOptions: {
                primary: true, //When a column is marked primary, when the grid is loaded, refreshed, or on the '3rd click', the grid is grouped by this column
                groupByFunction: function(collectionElement) {
                    return collectionElement.model.get('category').displayName;
                },
                groupByRowFormatter: function(collectionElement) {
                    return collectionElement;
                }
            },
            hoverTip: 'patient_generated_type'
        }, {
            name: 'qna',
            label: 'Questions and Answers',
            cell: 'handlebars',
            template: rowtemplate
        }

    ];

    var fetchOptions = {
        resourceTitle: 'patient-self-assessment',
        pageable: false,
        cache: true,
        criteria: {},
        viewModel: {
            parse: function(response) {
                return response;
            }
        },
        onSuccess: function(collection) {
            //console.log('FETCH SUCCESS');
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
            this._super.onRender.apply(this, arguments);
        }
    });

    var applet = {
        id: "patient_self_assessment",
        viewTypes: [{
            type: 'summary',
            view: AppletGridView,
            chromeEnabled: true
        }],
        defaultViewType: 'summary'
    };

    return applet;
});