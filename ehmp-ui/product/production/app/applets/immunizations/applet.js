define([
    'backbone',
    'marionette',
    'app/applets/immunizations/util',
    'app/applets/immunizations/modal/modalView',
    'hbs!app/applets/immunizations/list/siteTemplate',
    'hbs!app/applets/immunizations/list/reactionTemplate',
    'hbs!app/applets/immunizations/list/commentTemplate',
    'hbs!app/applets/immunizations/list/administeredDateTimeTemplate',
    "app/applets/immunizations/modal/modalHeaderView",
    "app/applets/immunizations/modal/modalFooterView",
    "app/applets/immunizations/appConfig",
    "app/applets/immunizations/gistUtil",
    "hbs!app/applets/immunizations/templates/tooltip"
], function(Backbone, Marionette, Util, ModalView, siteTemplate, reactionTemplate, commentTemplate, administeredTemplate, modalHeader, modalFooter, CONFIG, gUtil, tooltip) {

    'use strict';
    // Switch ON/OFF debug info
    var DEBUG = CONFIG.debug;
    //Data Grid Columns
    var summaryColumns = [{
        name: 'name',
        label: 'Vaccine Name',
        cell: 'string',
        hoverTip: 'immunizations_vaccinename'
    }, {
        name: 'reactionName',
        label: 'Reaction',
        cell: 'handlebars',
        template: reactionTemplate,
        hoverTip: 'immunizations_reaction'
    }, {
        name: 'administeredFormatted',
        label: 'Date',
        cell: 'string',
        sortValue: function(model, sortKey) {
            return model.get("administeredDateTime");
        },
        hoverTip: 'immuninizations_date'
    }, {
        name: 'facilityMoniker',
        label: 'Facility',
        cell: 'string',
        hoverTip: 'immuninizations_facility'
    }];

    //    var fullScreenColumns = summaryColumns.slice(0);

    var fullScreenColumns =
        summaryColumns.concat([{
            name: '',
            cell: 'handlebars',
            template: commentTemplate
        }]);

    fullScreenColumns.splice(1, 0, {
        name: 'standardizedName',
        label: 'Standardized Name',
        cell: 'string',
        hoverTip: 'immuninizations_standardizedname'
    });

    fullScreenColumns.splice(3, 0, {
        name: 'seriesName',
        label: 'Series',
        cell: 'string',
        hoverTip: 'immuninizations_series'
    }, {
        name: 'contraindicatedDisplay',
        label: 'Repeat Contraindicated',
        cell: 'string',
        hoverTip: 'immuninizations_repeatcontraindicated'
    });


    var PanelModel = Backbone.Model.extend({
        defaults: {
            type: 'panel'
        }
    });
    var gistParseModel = {
        parse: function(response) {
            if (DEBUG) console.log("gistParseModel----->>");
            if (DEBUG) console.log(response);
            response.tooltip = tooltip(response);
            return response;
        }
    };

    var gistConfiguration = {
        transformCollection: function(collection) {
            if (DEBUG) console.log("ImmunGist ----->> preare collection (grouping)");
            var shallowCollection = collection.clone();
            var i_group = [];
            var arr_cid = [];
            var remove = [];
            var i, k;
            // parse model
            for (i = 0; i < shallowCollection.length; i++) {
                // model parsing
                collection.at(i).set({
                    administeredFormatted: ADK.utils.formatDate(shallowCollection.at(i).get("administeredDateTime")),
                    timeSince: shallowCollection.at(i).get("administeredDateTime"),
                    isReaction: gUtil.isReaction(shallowCollection.at(i).get("reactionName")),
                    seriesNorm: gUtil.seriesNormalization(shallowCollection.at(i).get("seriesName"))
                });
                //-------------
                if (DEBUG) console.log(shallowCollection.at(i).get("name"));
                if (!_.contains(arr_cid, shallowCollection.at(i).cid)) {
                    i_group = shallowCollection.where({
                        name: shallowCollection.at(i).get("name")
                    });
                    for (k = 0; k < i_group.length; k++) {
                        arr_cid.push(i_group[k].cid);
                    }
                    i_group = _.without(i_group, shallowCollection.at(i));
                    remove = _.union(remove, i_group);
                    shallowCollection.at(i).set({
                        group: i_group,
                        group_items: i_group.length + 1
                    });
                }
            }
            // remove groupped models
            shallowCollection.remove(remove);
            collection.reset(shallowCollection.models, {
                reindex: true
            });


            _.each(collection.models, function(model) {
                model.set('tooltip', tooltip(model.attributes));

            });
            //------------------------
            //var gistImmunCollection = new Backbone.Collection(collection);
            //gistImmunCollection.reset(collection);
            //if(DEBUG) console.log(gistImmunCollection.toJSON());
            return collection;
        },
        gistModel: [{
            id: 'name',
            field: 'name'
        }, {
            id: 'seriesNorm',
            field: 'seriesNorm' //'series'
        }, {
            id: 'age',
            field: 'timeSince' //'age'
        }],
        //filterFields: ['name','series', 'age'],
        defaultView: 'pill' //'intervention'
    };
    var viewParseModel = {
        parse: function(response) {
            response = Util.getAdministeredFormatted(response);
            response = Util.getContraindicated(response);
            response = Util.getFacilityColor(response);
            response = Util.getStandardizedName(response);
            response = Util.getCommentBubble(response);
            return response;
        }
    };

    //Collection fetchOptions
    var summaryConfiguration = {
        fetchOptions: {
            resourceTitle: 'patient-record-immunization',
            pageable: true,
            viewModel: viewParseModel,
            cache: true
        }
    };
    var fetchOptions = {
        resourceTitle: 'patient-record-immunization',
        pageable: true,
        viewModel: viewParseModel,
        cache: true
    };

    var _super;
    var GridApplet = ADK.Applets.BaseGridApplet;
    var immunizationChannel = ADK.Messaging.getChannel('immunization');

    var AppletLayoutView = GridApplet.extend({
        initialize: function(options) {
            if (DEBUG) console.log("Immunizations initialization ----->>");
            _super = GridApplet.prototype;
            var dataGridOptions = {};
            if (this.columnsViewType === "expanded") {
                dataGridOptions.columns = fullScreenColumns;
            } else if (this.columnsViewType === "summary") {
                dataGridOptions.columns = summaryColumns;
            } else {
                dataGridOptions.summaryColumns = summaryColumns;
                dataGridOptions.fullScreenColumns = fullScreenColumns;
            }
            dataGridOptions.enableModal = true;

            if (ADK.UserService.hasPermission('add-patient-immunization') && ADK.PatientRecordService.isPatientInPrimaryVista()) {
                dataGridOptions.onClickAdd = function() {
                    immunizationChannel.command('openImmunizationSearch', 'immunization_add');
                };
            }

            dataGridOptions.tblRowSelector = '#data-grid-immunizations tbody tr';
            var self = this;

            dataGridOptions.onClickRow = function(model, event, gridView) {
                event.preventDefault();

                if (model instanceof PanelModel) {
                    if (!$(event.currentTarget).data('isOpen')) {
                        $(event.currentTarget).data('isOpen', true);
                    } else {
                        var k = $(event.currentTarget).data('isOpen');
                        k = !k;
                        console.log(k);
                        $(event.currentTarget).data('isOpen', k);
                    }

                    var i = $(event.currentTarget).find('.js-has-panel i');
                    if (i.length) {
                        if (i.hasClass('fa-chevron-up')) {
                            i.removeClass('fa-chevron-up')
                                .addClass('fa-chevron-down');
                            $(event.currentTarget).data('isOpen', true);
                        } else {
                            i.removeClass('fa-chevron-down')
                                .addClass('fa-chevron-up');
                            $(event.currentTarget).data('isOpen', false);
                        }
                    }
                    gridView.expandRow(model, event);
                } else {
                    model.set('isNotAPanel', true);
                    var view = new ModalView({
                        model: model,
                        target: event.currentTarget,
                        navHeader: true,
                        gridCollection: dataGridOptions.collection
                    });

                    view.resetSharedModalDateRangeOptions();

                    var modalOptions = {
                        'title': Util.getModalTitle(model),
                        'size': 'large',
                        'headerView': modalHeader.extend({
                            model: model,
                            theView: view
                        }),
                        /*
                        jsaenz (02-05-2015) The footer writeback buttons have been descoped for psi6. Leave
                                            this commented until their return.
                        'footerView': modalFooter.extend({
                            model: model
                        })
                        */
                    };

                    ADK.showModal(view, modalOptions);
                }
            };

            fetchOptions.onSuccess = function() {
                dataGridOptions.collection.reset(dataGridOptions.collection.originalModels);
                if (dataGridOptions.collection.length > 0) {
                    $('#data-grid-immunizations tbody tr').each(function() {
                        $(this).attr("data-infobutton", $(this).find('td:first').text());
                    });
                }
            };
            dataGridOptions.collection = ADK.PatientRecordService.fetchCollection(fetchOptions);
            this.dataGridOptions = dataGridOptions;
            _super.initialize.apply(this, arguments);


        },
        onRender: function() {
            _super.onRender.apply(this, arguments);

        }
    });
    // expose gist detail view through messaging
    var channel = ADK.Messaging.getChannel('immunizations');
    channel.on('getDetailView', function(params) {
        if (DEBUG) console.log("Immunizations gistDetailView ----->>");
        var view = new ModalView({
            model: params.model,
            //target: event.currentTarget,
            navHeader: true,
            gridCollection: params.collection
        });

        view.resetSharedModalDateRangeOptions();

        var modalOptions = {
            'title': Util.getModalTitle(params.model),
            'size': 'large',
            /*
             jsaenz (02-05-2015) The footer writeback buttons have been descoped for psi6. Leave
                                 this commented until their return.
             'footerView': modalFooter.extend({
                 model: params.model
             })
             */
            'headerView': modalHeader.extend({
                model: params.model,
                theView: view
            }),
        };
        ADK.showModal(view, modalOptions);
    });
    // expose detail view through messaging
    channel.reply('detailView', function(params) {

        var fetchOptions = {
            criteria: {
                "uid": params.uid
            },
            patient: new Backbone.Model({
                icn: params.patient.icn,
                pid: params.patient.pid
            }),
            resourceTitle: 'patient-record-immunization',
            viewModel: viewParseModel
        };

        var response = $.Deferred();

        var data = ADK.PatientRecordService.fetchCollection(fetchOptions);
        data.on('sync', function() {
            var detailModel = data.first();
            response.resolve({
                view: new ModalView({
                    model: detailModel,
                    navHeader: false
                }),
                title: Util.getModalTitle(detailModel)
            });
        }, this);

        return response.promise();
    });

    var GistView = ADK.AppletViews.PillsGistView.extend({
        className: 'app-size',
        initialize: function(options) {
            var self = this;
            this._super = ADK.AppletViews.PillsGistView.prototype;
            fetchOptions.onSuccess = function() {
                self.appletOptions.collection.reset(self.appletOptions.collection.models);
            };
            this.appletOptions = {
                filterFields: ["name"],
                collectionParser: gistConfiguration.transformCollection,
                gistModel: gistConfiguration.gistModel,
                collection: ADK.PatientRecordService.fetchCollection(fetchOptions)
            };
            this._super.initialize.apply(this, arguments);
        }
    });

    var applet = {
        id: "immunizations",
        viewTypes: [{
            type: 'gist',
            view: GistView,
            chromeEnabled: true
        }, {
            type: 'summary',
            view: AppletLayoutView.extend({
                columnsViewType: "summary"
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