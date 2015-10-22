define([
    'backbone',
    'marionette',
    'jquery',
    'app/applets/vitals/util',
    "app/applets/vitals/gistConfig",
    'app/applets/vitals/vitalsCollectionHandler',
    'app/applets/vitals/modal/modalView',
    'hbs!app/applets/vitals/list/siteTemplate',
    'hbs!app/applets/vitals/list/vitalTypeTemplate',
    'hbs!app/applets/vitals/list/resultTemplate',
    'hbs!app/applets/vitals/list/refRangeTemplate',
    'hbs!app/applets/vitals/list/resultedTemplate',
    'hbs!app/applets/vitals/list/observedTemplate',
    'hbs!app/applets/vitals/list/rowTemplate',
    'hbs!app/applets/vitals/list/itemTemplate',
    'hbs!app/applets/vitals/list/gridTemplate',
    'hbs!app/applets/vitals/list/layoutTemplate',
    'hbs!app/applets/vitals/list/qualifierTemplate',
    'hbs!app/applets/vitals/modal/detailsFooterTemplate',
    'app/applets/vitals/modal/modalHeaderView',
    'hbs!app/applets/vitals/templates/tooltip',
    'app/applets/vitals/modal/stackedGraph',
], function(Backbone, Marionette, $, Util, gistConfig, collectionHandler, ModalView, siteTemplate, vitalTypeTemplate, resultTemplate, refRangeTemplate, resultedTemplate, observedTemplate, rowTemplate, itemTemplate, gridTemplate, layoutTemplate, qualifierTemplate, detailsFooterTemplate, modalHeader, tooltip, StackedGraph) {

    'use strict';
    var model;
    //Data Grid Columns
    var displayNameCol = {
        name: 'displayName',
        label: 'Vital',
        cell: 'string'
    };
    var flagCol = {
        name: '',
        label: 'Flag',
        cell: 'string'
    };
    var resultCol = {
        name: 'resultUnitsMetricResultUnits',
        label: 'Result',
        cell: 'handlebars',
        template: resultTemplate,
        hoverTip: 'vitals_result'
    };
    var observedFormattedCol = {
        name: 'observedFormatted',
        label: 'Date Observed',
        cell: 'handlebars',
        template: observedTemplate,
        hoverTip: 'vitals_dateobserved'
    };
    var observedFormattedCoversheetCol = {
        name: 'observedFormattedCover',
        label: 'Date Observed',
        cell: 'string'
    };
    var facilityCodeCol = {
        name: 'facilityMoniker',
        label: 'Facility',
        cell: 'string',
        hoverTip: 'vitals_facility'
    };
    var typeNameCol = {
        name: 'typeName',
        label: 'Type',
        cell: 'string',
        hoverTip: 'vitals_type'
    };
    var refRangeCol = {
        name: 'referenceRange',
        label: 'Reference Range',
        cell: 'string'
    };
    var resultedDateCol = {
        name: 'resulted',
        label: 'Date Entered',
        cell: 'handlebars',
        template: resultedTemplate,
        hoverTip: 'vitals_dateentered'
    };
    var qualifierCol = {
        name: 'qualifiers',
        label: 'Qualifiers',
        cell: 'handlebars',
        template: qualifierTemplate,
        hoverTip: 'vitals_qualifiers'
    };

    var summaryColumns = [displayNameCol, resultCol, observedFormattedCoversheetCol];

    var fullScreenColumns = [observedFormattedCol, typeNameCol, resultCol, resultedDateCol, qualifierCol, facilityCodeCol];

    var gridCollectionStore;
    //Collection fetchOptions
    var fetchOptions = {
        resourceTitle: 'patient-record-vital',
        pageable: false,
        cache: true,
        criteria: {}
    };

    fetchOptions.viewModel = {
        parse: function(response) {
            return response;
        }
    };

    function parseModel(response) {
        response = Util.getObservedFormatted(response);
        // response = Util.getObservedTimeFormatted(response);
        response = Util.getFacilityColor(response);
        response = Util.getObservedFormattedCover(response);
        // response = Util.getStandardizedName(response);
        response = Util.getResultedFormatted(response);
        // response = Util.getResultedTimeFormatted(response);
        response = Util.getDisplayName(response);
        response = Util.getTypeName(response);
        response = Util.noVitlasNoRecord(response);
        response = Util.getFormattedHeight(response);
        response = Util.getResultUnits(response);
        response = Util.getMetricResultUnits(response);
        response = Util.getResultUnitsMetricResultUnits(response);
        response = Util.getReferenceRange(response);
        response = Util.getFormattedWeight(response);
        return response;
    }


    var gistConfiguration = gistConfig;
    //Collection fetchOption

    var _super;
    var gridView;
    var GridApplet = ADK.Applets.BaseGridApplet;
    var AppletLayoutView = GridApplet.extend({
        initialize: function(options) {
            var viewType = 'summary';
            var self = this;
            _super = GridApplet.prototype;
            var dataGridOptions = {};

            //dataGridOptions.filterEnabled = false; //Defaults to true
            //dataGridOptions.filterFields = ['summary']; //Defaults to all columns
            if (this.columnsViewType === "expanded" || options.appletConfig.fullScreen) {
                dataGridOptions.columns = fullScreenColumns;
                fetchOptions.pageable = false;
                dataGridOptions.filterEnabled = true;
                self.isFullscreen = true;
                options.appletConfig.viewType = 'expanded';
            } else if (this.columnsViewType === "gist") {
                dataGridOptions.columns = summaryColumns;
                dataGridOptions.filterEnabled = false;
                self.isFullscreen = false;
                dataGridOptions.gistView = true;
                dataGridOptions.appletConfiguration = gistConfiguration;
                fetchOptions.pageable = false;
            } else {
                dataGridOptions.summaryColumns = summaryColumns;
                dataGridOptions.fullScreenColumns = fullScreenColumns;
                dataGridOptions.filterEnabled = true;
                self.isFullscreen = false;
                options.appletConfig.viewType = 'summary';
            }
            options.appletConfig.tileSortingUniqueId = 'typeName';
            dataGridOptions.enableModal = true;

            // var table = setInterval(function() {
            //     if ($(".panel.panel-primary[title='Vitals']").length) {
            //         clearInterval(table);
            //         $(".panel.panel-primary[title='Vitals']").find(".grid-footer.panel-footer").addClass("hidden");
            //     }
            // }, 500);
            // self.getExposure();

            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {

                if (self.isFullscreen) {
                    fetchOptions.criteria = {
                        filter: 'and(ne(removed, true),' + self.buildJdsDateFilter('observed') + ')'
                    };
                } else {
                    fetchOptions.criteria = {
                        filter: 'and(ne(removed, true),' + self.buildJdsDateFilter('observed') + '), ne(result,Pass)'
                    };
                }
                fetchOptions.collectionConfig = {
                    collectionParse: function() {
                        return self.filterCollection.apply(self, arguments);
                    }
                };

                fetchOptions.onSuccess = function(collection) {
                    collectionHandler.addTooltips(collection, 4);
                    if (self.isFullscreen) {
                        collection.trigger('reset');
                    } else {
                        collection.trigger('vitals:globalDateFetch');
                    }

                    var sortId = self.appletConfig.instanceId + '_' + self.appletConfig.id;
                    var uniqueId;

                    if (!_.isUndefined(self.dataGridOptions.appletConfiguration)) {
                        uniqueId = self.dataGridOptions.appletConfiguration.tileSortingUniqueId;
                    }

                    if (_.isUndefined(uniqueId) && !_.isUndefined(self.dataGridOptions.appletConfig.tileSortingUniqueId)) {
                        uniqueId = self.dataGridOptions.appletConfig.tileSortingUniqueId;
                    }

                    if (!_.isUndefined(uniqueId))
                        ADK.TileSortManager.getSortOptions(collection, sortId, uniqueId);
                };

                ADK.PatientRecordService.fetchCollection(fetchOptions, self.dataGridOptions.collection);
            });

            fetchOptions.collectionConfig = {
                collectionParse: function() {
                    return self.filterCollection.apply(self, arguments);
                }
            };


            if (self.isFullscreen) {
                fetchOptions.criteria = {
                    filter: 'and(ne(removed, true),' + self.buildJdsDateFilter('observed') + ')'
                };
            } else {
                fetchOptions.criteria = {
                    filter: 'and(ne(removed, true),' + self.buildJdsDateFilter('observed') + '), ne(result,Pass)'
                };
            }

            fetchOptions.onSuccess = function() {
                collectionHandler.addTooltips(dataGridOptions.collection, 4);
            };
            dataGridOptions.appletId = 'vitals';
            this.dataGridOptions = dataGridOptions;

            self.dataGridOptions.collection = ADK.PatientRecordService.fetchCollection(fetchOptions);

            // this gridview is required for several applets in order to refresh the
            // gridview on save, update and delete
            gridView = this;
            //this.listenTo(self.dataGridOptions.collection, 'sync', this.filterCollection);
            if (ADK.UserService.hasPermission('add-patient-vital') && ADK.PatientRecordService.isPatientInPrimaryVista()) {
                dataGridOptions.onClickAdd = function(event) {
                    var addVitalsChannel = ADK.Messaging.getChannel('addVitals');
                    addVitalsChannel.trigger('addVitals:clicked', event, gridView);
                };
            }


            var showModal = function(model, event) {
                event.preventDefault();
                var view = new ModalView({
                    model: model,
                    target: event.currentTarget,
                    gridCollection: dataGridOptions.collection

                });
                view.resetSharedModalDateRangeOptions();
                var modalOptions = {
                    'title': model.get('typeName'),
                    'size': 'xlarge',
                    'headerView': modalHeader.extend({
                        model: model,
                        theView: view
                    }),
                    footerView: Backbone.Marionette.ItemView.extend({
                        template: detailsFooterTemplate,
                        events: {
                            'click #error': 'enteredInError'
                        },
                        enteredInError: function(event) {
                            var vitalEnteredInErrorChannel = ADK.Messaging.getChannel('vitalsEiE');
                            vitalEnteredInErrorChannel.trigger('vitalsEiE:clicked', event, {
                                'collection': self.dataGridOptions.collection.models,
                                'title': model.attributes.observedFormatted,
                                'checked': model.attributes.localId,
                                'gridView': gridView
                            });
                        }
                    }),
                    'regionName': 'vitalsDetailsDialog'
                };

                var modal = new ADK.UI.Modal({
                    view: view,
                    options: modalOptions
                });
                modal.show();
            };

            dataGridOptions.onClickRow = function(model, event, gridView) {
                showModal(model, event);
            };


            //US2396 : commented out for demo on 11/5
            //dataGridOptions.onClickAdd = function(event) {
            //    console.log(  'onClickAdd');
            //    var addVitalsChannel = ADK.Messaging.getChannel('addVitals');
            //    addVitalsChannel.trigger('addVitals:clicked', event);
            //};

            var VitalsItemView = Backbone.Marionette.ItemView.extend({
                tagName: 'tr',
                attributes: function() {
                    if (this.model.get('observedDateLatest') !== undefined) {
                        return {
                            'tabindex': '0',
                            'class': this.model.get('observedDateLatest') + ' clickable'
                        };
                    } else {
                        return {
                            'tabindex': '0',
                            'class': this.model.get('observedDateLatest') + ''
                        };
                    }
                },
                template: itemTemplate,
                events: {
                    'click td': function(e) {
                        //showModal(this.model, e);

                        ADK.utils.infoButtonUtils.onClickFunc(this, e, baseOnClickRow);

                        function baseOnClickRow(that, event) {
                            showModal(that.model, event);
                        }
                    }
                }
            });

            var VitalsCompositeView = Backbone.Marionette.CompositeView.extend({
                initialize: function(options) {
                    this.collection = options.collection;
                },
                template: gridTemplate,
                childView: VitalsItemView,
                childViewContainer: 'tbody'
            });

            var VitalsLayoutView = Backbone.Marionette.LayoutView.extend({
                initialize: function(options) {
                    this.collection = options.collection;
                    this.listenTo(this.collection, 'vitals:globalDateFetch', this.render);
                },
                regions: {
                    leftTable: '.a-table',
                    rightTable: '.b-table'
                },
                template: layoutTemplate,
                onRender: function() {
                    var count = this.collection.length;
                    var middle = Math.floor(count / 2);
                    var leftCol = new Backbone.Collection(this.collection.slice(0, middle));
                    var rightCol = new Backbone.Collection(this.collection.slice(middle, count));
                    if (this.collection.length > 0) {
                        this.leftTable.show(new VitalsCompositeView({
                            collection: leftCol
                        }));
                        this.rightTable.show(new VitalsCompositeView({
                            collection: rightCol
                        }));

                    } else {
                        this.$el.find('.a-table')
                            .after('<div class="emptyTextVital">No Records Found</div>');
                    }

                }
            });



            dataGridOptions.filterDateRangeEnabled = true;
            dataGridOptions.filterDateRangeField = {
                name: "observed",
                label: "Date",
                format: "YYYYMMDD"
            };


            this.dataGridOptions = dataGridOptions;

            if (!self.isFullscreen) {
                if (this.dataGridOptions.gistView) {
                    this.dataGridOptions.GistView = VitalsLayoutView;
                    this.dataGridOptions.SummaryView = ADK.Views.VitalsGist.getView();
                    this.dataGridOptions.SummaryViewOptions = {
                        //collectionParser: gistConfiguration.transformCollection,
                        gistModel: gistConfiguration.gistModel,
                        gistHeaders: gistConfiguration.gistHeaders,
                        enableTileSorting: true,
                        tileSortingUniqueId: 'typeName'

                    };
                } else {
                    this.dataGridOptions.SummaryView = VitalsLayoutView;
                }
            }

            _super.initialize.apply(this, arguments);


        },
        onRender: function() {
            _super.onRender.apply(this, arguments);

        },
        onSync: function() {
            if (this.columnsViewType === 'summary') {
                this.dataGridOptions.tblRowSelector = '[data-appletid="vitals"] tr';
                this.dataGridOptions.tblRowSelectorColumn = 'td:first';
            } else {
                this.dataGridOptions.tblRowSelector = '#data-grid-vitals tbody tr';
                this.dataGridOptions.tblRowSelectorColumn = 'td:nth-child(2)';
            }
            _super.onSync.apply(this, arguments);
        },
        filterCollection: collectionHandler.filterCollection
    });



    // expose gist detail view through messaging
    var channel = ADK.Messaging.getChannel('vitals');

    channel.on('detailView', function(params) {
        var vitalsTitle;
        if (params.model.get('typeName') == 'Blood Pressure Systolic' || params.model.get('typeName') == 'Blood Pressure Diastolic') {
            vitalsTitle = 'Blood Pressure';
        } else {
            vitalsTitle = params.model.get('typeName');
        }
        var modal = new ADK.UI.Modal({
            view: new ModalView({
                model: params.model,
                navHeader: false
            }),
            options: {
                size: "xlarge",
                title: vitalsTitle
            }
        });
        modal.show();
    });

    /* the following function is for tesxt search. please do not remove this code */
    channel.reply('detailView', function(params) {
        var fetchOptions = {
            criteria: {
                "uid": params.uid
            },
            patient: new Backbone.Model({
                icn: params.patient.icn,
                pid: params.patient.pid
            }),
            resourceTitle: 'patient-record-vital'
        };

        var response = $.Deferred();

        var data = ADK.PatientRecordService.fetchCollection(fetchOptions),
            pidSiteCode,
            detailModel;
        data.on('sync', function() {
            detailModel = data.first();
            var siteCode = ADK.UserService.getUserSession().get('site'),
                pidSiteCode = detailModel.get('pid') ? detailModel.get('pid').split(';')[0] : '';
            var vitalsTitle;
            if (detailModel.get('typeName') == 'Blood Pressure Systolic' || detailModel.get('typeName') == 'Blood Pressure Diastolic') {
                vitalsTitle = 'Blood Pressure';
            } else {
                vitalsTitle = detailModel.get('typeName');
            }
            response.resolve({
                view: new ModalView({
                    model: detailModel,
                    collection: data,
                    navHeader: false
                }),
                title: vitalsTitle,
                modalSize: "xlarge",
            });
        }, this);

        return response.promise();
    });
    /* end function for text search */
    
    channel.reply('chartInfo', function(params) {
        var displayName = Util.getDisplayName({
            typeName: params.typeName
        }).displayName;

        var VitalModel = Backbone.Model.extend({});
        var vitalModel = new VitalModel({
            typeName: params.typeName,
            displayName: displayName,
            requesterInstanceId: params.instanceId,
            graphType: params.graphType,
            applet_id: applet.id
        });

        var response = $.Deferred();

        var stackedGraph = new StackedGraph({
            model: vitalModel,
            target: null
        });

        response.resolve({
            view: stackedGraph
        });

        return response.promise();
    });


    /*    channel.reply('detailView', function(params) {

            var fetchOptions = {
                criteria: {
                    "uid": params.uid
                },
                patient: new Backbone.Model({
                    icn: params.patient.icn,
                    pid: params.patient.pid
                }),
                resourceTitle: 'patient-record-vital',
                viewModel: {
                    parse: parseModel
                }
            };

            var response = $.Deferred();

            var data = ADK.PatientRecordService.fetchCollection(fetchOptions);
            data.on('sync', function() {
                var detailModel = data.first();
                response.resolve({
                    view: new ModalView({
                        model: detailModel,
                        target: null,
                        gridCollection: data
                    }),
                    title: detailModel.get('typeName'),
                    footerView: Backbone.Marionette.ItemView.extend({
                        template: detailsFooterTemplate,
                        events: {
                            'click #error': 'enteredInError'
                        },
                        enteredInError: function(event) {
                            var vitalEnteredInErrorChannel = ADK.Messaging.getChannel('vitalsEiE');
                            vitalEnteredInErrorChannel.trigger('vitalsEiE:clicked', event, {
                                'collection': self.dataGridOptions.collection.models,
                                'title': detailModel.attributes.observedFormatted,
                                'checked': detailModel.attributes.localId,
                                'gridView': gridView
                            });
                        }
                    })
                });
            }, this);

            return response.promise();
        });*/

    channel.reply('refreshGridView', function() {
        var refreshed = false;
        if (_.isObject(gridView) === true) {
            gridView.refresh({});
            refreshed = true;
        }
        return refreshed;
    });


    var applet = {
        id: "vitals",
        viewTypes: [{
            type: 'summary',
            view: AppletLayoutView.extend({
                columnsViewType: "summary"
            }),
            chromeEnabled: true
        }, {
            type: 'gist',
            view: AppletLayoutView.extend({
                columnsViewType: "gist"
            }),
            chromeEnabled: true
        }, {
            type: 'expanded',
            view: AppletLayoutView.extend({
                columnsViewType: "expanded"
            }),
            chromeEnabled: true
        }],
        defaultViewType: 'summary'
    };

    return applet;
});