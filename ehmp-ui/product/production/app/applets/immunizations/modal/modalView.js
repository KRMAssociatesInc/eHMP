define([
    "jquery",
    "jquery.inputmask",
    "backbone",
    "marionette",
    "underscore",
    'app/applets/immunizations/util',
    'app/applets/immunizations/appletHelpers',
    "app/applets/immunizations/modal/filterDateRangeView",
    'hbs!app/applets/immunizations/list/resultTemplate',
    'hbs!app/applets/immunizations/list/dateTemplate',
    'hbs!app/applets/immunizations/list/siteTemplate',
    'hbs!app/applets/immunizations/modal/modalTemplate',
    "hbs!app/applets/immunizations/modal/dateRangeTemplate",
    "hbs!app/applets/immunizations/modal/totalTestsTemplate",
    "app/applets/immunizations/modal/modalHeaderView",
    "app/applets/immunizations/modal/modalFooterView"
  ], function($, InputMask, Backbone, Marionette, _, Util, AppletHelper, FilterDateRangeView, resultTemplate, dateTemplate, siteTemplate, modalTemplate, dateRangeTemplate, totalTestsTemplate, modalHeader, modalFooter) {
    'use strict';
    var currentModel, currentCollection, gridOptions = {},
    columns, mockData2, DataGridView, DataGridCollection, chartOptions, Chart, categories, data, fetchCollection = {},
    low, high, TotalTestModel;
    var modals = [],
    panelModals = [], modalDisplayName,
    dataCollection;

    DataGridCollection = Backbone.Collection.extend({});

    columns = [{
        name: "administeredFormatted",
        label: "Date",
        cell: "string",
        sortable: false
    }, {
        name: "summary",
        cell: "string",
        label: "Summary",
        sortable: false
    }, {
        name: "reactionName",
        cell: "string",
        label: "Reaction",
        sortable: false
    }, {
        name: "seriesName",
        cell: "string",
        label: "Series",
        sortable: false
    }, {
        name: "contraindicatedDisplay",
        cell: "string",
        label: "Repeat Contraindicated",
        sortable: false
    }, {
        name: "facilityMoniker",
        label: "Facility",
        cell: "string",
        sortable: false
    }];

    gridOptions.columns = columns;
    gridOptions.appletConfig = {
        name: 'immunizations_modal',
        id: 'immunizations-modalView'
    };

    var DateRangeModel = Backbone.Model.extend({
        defaults: {
            fromDate: moment().subtract('years', 1).format("YYYY-MM-DD"),
            toDate: moment().format("YYYY-MM-DD")
        }
    });

    var dateRange = new DateRangeModel();
    var filterDateRangeView = new FilterDateRangeView({
        model: dateRange
    });

    var sharedDateRange;

    function parseModel(response) {
        response = Util.getAdministeredFormatted(response);
        response = Util.getContraindicated(response);
        response = Util.getFacilityColor(response);
        response = Util.getStandardizedName(response);
        response = Util.getObservedFormatted(response);
        response = Util.getObservedTimeFormatted(response);
        response = Util.getFacilityColor(response);
        response = Util.getResultedFormatted(response);
        response = Util.getResultedTimeFormatted(response);
        response = Util.getNumericDate(response);

        return response;
    }


    var TotalView = Backbone.Marionette.ItemView.extend({
        template: totalTestsTemplate,
        tagName: 'span',
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        }

    });

   TotalTestModel = Backbone.Model.extend({
        defaults: {
            totalTests: 0
        }
   });

   var totalTestModel = new TotalTestModel();

    var ModalView =  Backbone.Marionette.LayoutView.extend({
        template: modalTemplate,
        fetchOptions: {},
        initialize: function(options) {
            this.loadingView = ADK.Views.Loading.create();
            // this.loadingView2 = ADK.Views.Loading.create();
            dataCollection = options.gridCollection;
            this.getModals();

            if (this.showNavHeader) {
                this.model.attributes.navHeader = true;
            }

            this.fetchOptions.resourceTitle = 'patient-record-immunization';
            this.fetchOptions.criteria = {
                pid: this.model.attributes.pid // "10108V420871"
            };

            modalDisplayName = this.model.attributes.name;
            // this.target = options.target;


            var self = this;

            this.fetchOptions.collectionConfig = {
                collectionParse: self.filterCollection
            };

            this.fetchOptions.pageable = true;

            this.fetchOptions.onSuccess = function(collection, response) {
                // _super.expandRowDetails(options.routeParam);
                console.log("modalView.js", "size of collection is " + collection.length);
                self.collection = collection;
                self.$el.find('.immunizationsNext, .immunizationsPrev').attr('disabled', false);



                var tempCollection = self.collection.fullCollection.pluck('result');


                tempCollection = _.map(tempCollection, function(num) {
                    return _.isNaN(num * 1);
                });

                tempCollection = _.without(tempCollection, false);

                if (self.showNavHeader) {
                    self.model.attributes.navHeader = true;
                }

                var table;


                if (collection.length !== 0) {
                    table = setInterval(function() {
                        if ($('#lr-data-table-view').length) {
                            clearInterval(table);
                        }

                    }, 500);

                } else {
                    table = setInterval(function() {
                        if ($('#lr-data-table-view').length) {
                            clearInterval(table);
                        }

                    }, 500);
                }

                gridOptions.collection = self.collection;

                currentModel = options.model;
                self.model = options.model;
                currentCollection = options.collection;

                totalTestModel.set({
                    totalTests: gridOptions.collection.fullCollection.length
                });

                self.dataGrid = ADK.Views.DataGrid.create(gridOptions);

                if (self.leftColumn !== undefined && self.leftColumn !== null) {
                    self.leftColumn.reset();
                    self.leftColumn.show(self.dataGrid);
                }

        /*        $('#data-grid-immunizations-modalView tbody tr').each(function() {
                    $(this).attr("data-infobutton", $(this).text());
                });  */

                gridOptions.collection = self.collection;
                if (collection.length !== 0) {

                    self.paginatorView = ADK.Views.Paginator.create({
                        collection: gridOptions.collection,
                        windowSize: 4
                    });
                    $('.js-backgrid').append(self.paginatorView.render().el);
                } else {
                    $('#data-grid-immunizations-modalView').find('tbody').append($('<tr class="empty"><td colspan="4">No Records Found</td></tr>'));
                }
            }; // end of onSuccess
        },
        events: {
            'click .immunizationsNext': 'getNextModal',
            'click .immunizationsPrev': 'getPrevModal',
        },
        getNextModal: function(e) {
            var next = _.indexOf(modals, this.model) + 1;
            if (next >= modals.length) {
                // if (dataCollection.hasNextPage()) {
                //     dataCollection.getNextPage();
                // } else {
                //     dataCollection.getFirstPage();
                // }

                this.getModals();
                next = 0;
            }
            var model = modals[next];
            this.setNextPrevModal(model);

        },
        getPrevModal: function(e) {

            var next = _.indexOf(modals, this.model) - 1;
            if (next < 0) {
                // if (dataCollection.hasPreviousPage()) {
                //     dataCollection.getPreviousPage();
                // } else {
                //     dataCollection.getLastPage();
                // }

                this.getModals();
                next = modals.length - 1;
            }
            var model = modals[next];

            this.setNextPrevModal(model);

        },
        getModals: function() {
            modals = [];
            panelModals = [];
            if(dataCollection !== undefined){
                _.each(dataCollection.models, function(m, key) {

                    if (m.get('immunizations')) {
                        var outterIndex = dataCollection.indexOf(m);
                        // console.log('>>>>>outterIndex', outterIndex);
                        _.each(m.get('immunizations').models, function(m2, key) {
                            m2.set({
                                'inAPanel': true,
                                'parentIndex': outterIndex,
                                'parentModel': m
                            });
                            modals.push(m2);

                        });
                    } else {
                        modals.push(m);
                    }

                });
            }
            //console.log(modals);
        },
        setNextPrevModal: function(model) {
            if (this.showNavHeader) {
                model.attributes.navHeader = true;
            }
            if (model.get('inAPanel')) {
                var tr = $('#data-grid-immunizations > tbody>tr.selectable').eq(model.get('parentIndex'));
                if (!tr.data('isOpen')) {
                    tr.trigger('click');
                }
                $('#data-grid-immunizations > tbody>tr.selectable').not(tr).each(function() {
                    var $this = $(this);
                    if ($this.data('isOpen')) {
                        $this.trigger('click');
                    }

                });

            }

            var view = new ModalView({
                model: model,
                gridCollection: dataCollection,
                navHeader: this.showNavHeader
            });

            var siteCode = ADK.UserService.getUserSession().get('site'),
                pidSiteCode = model.get('pid') ? model.get('pid').split(';')[0] : '';

            var modalOptions = {
                'title': 'Vaccine - ' + model.get('name'),
                'size': 'large',
                'headerView': modalHeader.extend({
                    model: model,
                    theView: view,
                }),
                /*
                jsaenz (02-05-2015) The footer writeback buttons have been descoped for psi6. Leave
                                    this commented until their return.
                'footerView': modalFooter.extend({
                    model: model
                })
                */
            };

            var modal = new ADK.UI.Modal({
                view: view,
                options: modalOptions
            });
            modal.show();
        },
        regions: {
            leftColumn: '.js-backgrid',
            totalTests: '#total-tests',
            dateRangeFilter: '#date-range-filter'
        },
        resetSharedModalDateRangeOptions: function() {
            sharedDateRange = new DateRangeModel();
        },
        onRender: function() {
            var dateRange;

            if (sharedDateRange === undefined || sharedDateRange === null) {
                this.resetSharedModalDateRangeOptions();
            }

            if (sharedDateRange !== undefined && sharedDateRange !== null &&
                sharedDateRange.get('preSelectedDateRange') !== undefined &&
                sharedDateRange.get('preSelectedDateRange') !== null) {
                dateRange = sharedDateRange.clone();
            } else {
                dateRange = new DateRangeModel();
            }

            new DateRangeModel();
            var filterDateRangeView = new FilterDateRangeView({
                model: dateRange,
                parentView: this
            });
            filterDateRangeView.setFetchOptions(this.fetchOptions);
            filterDateRangeView.setSharedDateRange(sharedDateRange);

            this.dateRangeFilter.show(filterDateRangeView);

            this.leftColumn.show(this.loadingView);

            this.totalTests.show(new TotalView({
                model: totalTestModel
            }));

            self.collection = ADK.PatientRecordService.fetchCollection(this.fetchOptions);
        },filterCollection: function(coll) {
            coll.models.forEach(function(model) {
                model.attributes = parseModel(model.attributes);
            });

            var resultColl = [];
            var allTypes = $.unique(coll.pluck('name'));
            var knownTypes = [];
            var displayTypes = knownTypes.filter(function(el) {
                return allTypes.indexOf(el) != -1;
            });
            var newColl = new Backbone.Collection(coll.where({
                name: modalDisplayName
            }));

            //TODO: Remove once resource gets created
            newColl.each(function(column){
                if(column.attributes.numericDate <= moment(sharedDateRange.attributes.toDate).format("YYYYMMDD") && (column.attributes.numericDate >= moment(sharedDateRange.attributes.fromDate).format("YYYYMMDD") || sharedDateRange.attributes.fromDate === null)){
                    resultColl.push(column);
                }
            });

            // newColl.each(function(column){
            //     resultColl.push(column);
            // });
            return resultColl;
        }
    });

    return ModalView;
});
