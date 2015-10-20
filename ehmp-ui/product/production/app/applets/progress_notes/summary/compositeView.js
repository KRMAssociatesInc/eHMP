define([
    "backbone",
    "marionette",
    "underscore",
    "app/applets/progress_notes/summary/itemView",
    "app/applets/progress_notes/details/detailsItemView",
    "hbs!app/applets/progress_notes/summary/table",
    "hbs!app/applets/progress_notes/details/table",
    "app/applets/progress_notes/eventHandlers",
    "app/applets/progress_notes/appletConfig"
], function(Backbone, Marionette, _, itemView, detailsItemView, tableTemplate, detailsTableTemplate, EventHandlers, AppletConfig) {

    function sortFunc(event) {
        var ascending;
        var id = '#' + event.currentTarget.id;
        if ($(id).children('.fa').hasClass('fa-chevron-down')) {
            ascending = false;
        } else {
            ascending = true;
        }
        EventHandlers.sortCollection(this.collection, $(id).attr('col-name'), 'alphanumerical', ascending);

        $('.fa-chevron-down').removeClass('fa-chevron-down');
        $('.fa-chevron-up').removeClass('fa-chevron-up');

        if (ascending) {
            $(id).children("span").attr("class", 'fa fa-chevron-down');
        } else {
            $(id).children("span").attr("class", 'fa fa-chevron-up');
        }
    }

    return Backbone.Marionette.CompositeView.extend({
        initialize: function() {
            var fetchOptions = {
                resourceTitle: AppletConfig.resource,
                viewModel: AppletConfig.viewModel
            };
            this.collection = ADK.PatientRecordService.fetchCollection(fetchOptions);
        },

        events: {
            'click tr#progress-notes-summary-header > th': 'sortColumn',
            'click button#progress-notes-show-details': 'showDetailsModal'
        },

        showDetailsModal: function(event) {
            event.preventDefault();
            var coll = this.collection;

            var DetailsModalView = Backbone.Marionette.CompositeView.extend({
                initialize: function() {
                    this.collection = coll;
                },
                events: {
                    'click tr#progress-notes-details-header > th': 'sortColumn'
                },
                sortColumn: sortFunc,
                childView: detailsItemView,
                childViewContainer: "tbody",
                template: detailsTableTemplate,
                className: "panel panel-info"
            });
            var modalOptions = {
                'title': 'Progress Notes/Details',
                'size': "large"
            };

            var modal = new ADK.UI.Modal({
                view: new DetailsModalView(),
                options: modalOptions
            });
            modal.show();
        },

        sortColumn: sortFunc,
        childView: itemView,
        childViewContainer: "tbody",
        template: tableTemplate,
        className: "panel panel-info"
    });

});
