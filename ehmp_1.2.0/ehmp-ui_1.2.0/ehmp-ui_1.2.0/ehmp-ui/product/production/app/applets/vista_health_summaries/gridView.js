define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!app/applets/vista_health_summaries/list/facilityTemplate",
    "hbs!app/applets/vista_health_summaries/list/hsReportTemplate",
    "app/applets/vista_health_summaries/appletUiHelpers",
], function(Backbone, Marionette, _, facilityTemplate, hsReportTemplate, AppletUiHelper) {

    // custom sorting
    function customReportNameSort(model, sortKey) {
        var reportName = model.get('hsReport');

        if (!reportName) {
            return -4;
        }

        if (reportName.toLowerCase().indexOf('remote') === 0) {
            return  -1;
        } else {
            return -2;
        }

        return 0;
    }

    var ascSortComparator = function(left, right) {
        if(left == right) return 0;
        else if(left < right) return -1;
        return 1;
    };

	// data grid columns
	var facilityCol = {
        name: 'facilityMoniker',
        label: 'Facility',
        template: facilityTemplate,
        cell: "handlebars",
        groupable: true,
        groupableOptions: {
            primary:true,
            innerSort: 'hsReport',
            innerSortValue : ascSortComparator,
            groupByFunction: function(collectionElement) {
                return collectionElement.model.get("facilityMoniker");
            },
            //this takes the item returned by the groupByFunction
            groupByRowFormatter: function(item) {
                return item;
            }
        }
	};

	var isPrimaryCol = {
        name: 'isPrimary',
        label: 'Primary',
        cell: 'boolean',
        renderable: false
	};

    var reportIdCol = {
        name: 'reportID',
        label: 'Report ID',
        cell: 'number',
        renderable: false
    };

	var hsReportCol = {
        name: 'hsReport',
        label: 'Report',
        cell: "handlebars",
        template: hsReportTemplate,
        sortable: true,
        groupable: true,
        groupableOptions: {
            primary: true,
            innerSort: "facilityMoniker",
            groupByFunction: function(collectionElement) {
                var reportName = collectionElement.model.get("hsReport");

                if (reportName) {
                    if (reportName.toLowerCase().indexOf('remote') === 0) {
                        return 'AAA ' + reportName;
                    } else {
                        return reportName;
                    }
                } else {
                    return 'Error : report not available.';
                }
            },
            //this takes the item returned by the groupByFunction
            groupByRowFormatter: function(item) {
                var reportName = item.replace('AAA ', '');
                return reportName;
            }
        }
	};

	var summaryColumns = [facilityCol, hsReportCol];

	// site/report list fetch options
	var fetchOptions = {
        resourceTitle: 'healthsummaries-getSitesInfoFromPatientData',
        pageable: false,
        cache: false,
        viewModel: {
            parse: function(response) {
                response.uid = response.facilityMoniker + "-" + response.reportID;
                return response;
            }
        }
	};

    // define grid view applet
    var GridView = ADK.AppletViews.GridView.extend({
        collapseGroups : function() {
            this.$el.find('.groupByCountBadge').toggleClass('hidden');
            this.$el.find('tr.selectable').slideToggle(0);
            this.$el.find('td.groupByHeader.selectable').toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        },
        initialize: function(options) {

            this._super = ADK.AppletViews.GridView.prototype;
            var appletOptions = {
                columns : summaryColumns,
                groupable : true,
                //DetailsView: DetailsView,
                onClickRow: function(model, event, gridView) {
                    event.preventDefault();
                    AppletUiHelper.getDetailView(model, event.currentTarget, appletOptions.collection, true, AppletUiHelper.showModal, AppletUiHelper.showErrorModal);
                }
            };

            var self = this;

            fetchOptions.onSuccess = function(collection) {
                setTimeout(function() {
                    self.$el.find('.groupByCountBadge').toggleClass('hidden');
                    self.$el.find('tr.selectable').slideToggle(0);
                    self.$el.find('td.groupByHeader.selectable').toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                }, 10);
            };

            this.gridCollection = ADK.PatientRecordService.fetchCollection(fetchOptions);
            appletOptions.collection = this.gridCollection;

            this.appletOptions = appletOptions;
            this._super.initialize.apply(this, arguments);
        }
    });

    return GridView;

});
