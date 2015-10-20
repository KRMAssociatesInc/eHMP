define([
    'app/applets/allergyEiE/applet',
    'hbs!app/applets/allergy_grid/details/detailsFooterTemplate',
    'hbs!app/applets/allergy_grid/list/expirationCellTemplate',
    'app/applets/allergy_grid/modal/modalView',
    'app/applets/allergy_grid/util',
    'hbs!app/applets/allergy_grid/list/severityTemplate',
    'hbs!app/applets/allergy_grid/list/summaryItemViewTemplate',
    'hbs!app/applets/allergy_grid/list/summaryViewTemplate',
    'hbs!app/applets/allergy_grid/list/siteTemplate',
    'hbs!app/applets/allergy_grid/list/commentTemplate',
    'app/applets/allergy_grid/modal/modalHeaderView'
], function(EnteredInError, detailsFooterTemplate, expirationCellTemplate,
    ModalView, Util, severityTemplate, summaryItemViewTemplate, summaryViewTemplate, siteTemplate, commentTemplate, modalHeader) {
    'use strict';
    //Data Grid Columns
    var summaryColumns = [{
        name: 'summary',
        label: 'Allergen Name',
        cell: 'string',
        hoverTip: 'allergies_allergenName'
    }, {
        name: 'reaction',
        label: 'Reaction',
        cell: 'string',
        hoverTip: 'allergies_reaction'
    }, {
        name: 'acuityName',
        label: 'Severity',
        cell: 'handlebars',
        template: severityTemplate,
        hoverTip: 'allergies_severity'
    }];

    var fullScreenColumns =
        summaryColumns.concat([{
            name: 'drugClassesNames',
            label: 'Drug Class',
            cell: 'string',
            hoverTip: 'allergies_drugClass'
        }, {
            name: 'originatorName',
            label: 'Entered By',
            cell: 'string',
            hoverTip: 'allergies_enteredBy'
        }, {
            name: 'facilityName',
            label: 'Facility',
            cell: 'string',
            hoverTip: 'allergies_facility'
                //template: siteTemplate

        }, {
            name: '',
            cell: 'handlebars',
            template: commentTemplate
        }]);

    fullScreenColumns.splice(1, 0, {
        name: 'standardizedName',
        label: 'Standardized Allergen',
        cell: 'string',
        hoverTip: 'allergies_standardizedAllergen'
    });

    var viewParseModel = {
        parse: function(response) {

            if (response.products) {
                response = ADK.utils.extract(response, response.products[0], {
                    name: 'name'
                });
            }

            if (response.observations) {
                response = ADK.utils.extract(response, response.observations[0], {
                    acuityName: 'severity',
                    observed: 'date'
                });
                response = Util.getAcuityName(response);
                response.observedDate = ADK.utils.formatDate(response.observed, "MM/DD/YYYY - HH:mm");
            }

            response = Util.getDrugClasses(response);
            if (response.entered) {
                response.originatedFormatted = ADK.utils.formatDate(response.entered, "MM/DD/YYYY - HH:mm");
            }
            //response = Util.getComments(response);

            response = Util.getReactions(response);
            response = Util.getFacilityColor(response);
            response = Util.getStandardizedName(response);
            response = Util.getSeverityCss(response);
            response = Util.getCommentBubble(response);
            //response = Util.getOriginatedFormatted(response);
            return response;
        }
    };

    //Collection fetchOptions
    var fetchOptions = {
        resourceTitle: 'patient-record-allergy',
        viewModel: viewParseModel,
        criteria: {
            filter: 'ne(removed, true)'
        },
        cache: false,
        pageable: false
    };
    var defaultConfiguration = {
        fetchOptions: {
            resourceTitle: 'patient-record-allergy',
            viewModel: viewParseModel,
            criteria: {
                filter: 'ne(removed, true)'
            },
            cache: false,
            pageable: false
        }
    };
    var gistModel = [{
        id: 'name',
        field: 'summary'
    }, {
        id: 'severity',
        field: 'severityCss'
    }];

    var _super;
    var gridView;

    var showModal = function(model, event) {
        //event.preventDefault();
        var view = new ModalView({
            model: model,
            collection: ADK.PatientRecordService.fetchCollection(fetchOptions)
        });

        // ORIGINAL REMOVED: Will McVay, Team Saturn
        // Need to augment with a footer view that offers option to close
        // detail view or mark Entered in Error.
        var modalOptions = [{
            title: Util.getModalTitle(model)
        }];
        // New version includes custom footer view with an "Entered in Error" button
        // that invokes the allergyEiE applet as a modal and passes in the reaction data.
        // WRM/Saturn
        var siteCode = ADK.UserService.getUserSession().get('site'),
            pidSiteCode = model.get('pid') ? model.get('pid').split(';')[0] : '';

        modalOptions[1] = {
            title: Util.getModalTitle(model),
            headerView: modalHeader.extend({
                model: model,
                theView: view
            }),
            footerView: Backbone.Marionette.ItemView.extend({
                template: detailsFooterTemplate,
                onRender: function() {},
                events: {
                    'click #error': 'enteredInError'
                },
                enteredInError: function(event) {
                    var allergyEnteredInErrorChannel = ADK.Messaging.getChannel('allergyEiE');
                    allergyEnteredInErrorChannel.trigger('allergyEiE:clicked', event, model, gridView);
                },
                templateHelpers: function() {
                    if (ADK.UserService.hasPermission('remove-patient-allergy') && pidSiteCode === siteCode) {
                        return {
                            data: true
                        };
                    } else {
                        return {
                            data: false
                        };
                    }
                }
            }),
            callShow: true
        };

        var modal = new ADK.UI.Modal({
            view: view,
            options: modalOptions[1]
        });
        modal.show();
    };

    var AllergySummaryItemView = Backbone.Marionette.ItemView.extend({
        tagName: 'div',
        className: 'summaryItem',
        attributes: function() {
            return {
                'tabindex': '0'
            };
        },
        template: summaryItemViewTemplate,
        events: {
            'click span': function(e) {
                showModal(this.model, e);
            }
        }
    });

    var AllergySummaryView = Backbone.Marionette.CompositeView.extend({
        initialize: function(options) {
            this.collection = options.collection;
            this.maximizeScreen = options.appletConfig.maximizeScreen;
        },
        template: summaryViewTemplate,
        childView: AllergySummaryItemView,
        childViewContainer: '.allergyBubbleView',
        events: {
            'click a.seeAll': function(event) {
                event.preventDefault();
                ADK.Navigation.navigate(this.maximizeScreen);
            }
        },
        onRender: function() {
            if (this.collection.length > 0) {
                // this.$el.find('.allergyBubbleView')
                //     .after('<div class="summaryItem"><a class="seeAll" href="#">See All >></a></div>');
            } else {
                this.$el.find('.allergyBubbleView')
                    .after('<div class="emptyTextAllergy">No Records Found</div>');
            }
        }

    });

    var GridApplet = ADK.Applets.BaseGridApplet;
    var AppletLayoutView = GridApplet.extend({
        className: 'app-size',
        initialize: function(options) {
            _super = GridApplet.prototype;
            var dataGridOptions = {};
            dataGridOptions.enableModal = true;
            dataGridOptions.filterEnabled = false;
            dataGridOptions.tblRowSelector = '#data-grid-allergy_grid tbody tr';
            if (this.columnsViewType === "summary") {
                dataGridOptions.columns = summaryColumns;
                dataGridOptions.gistView = false;
                dataGridOptions.appletConfiguration = defaultConfiguration;
            } else {
                fetchOptions.pageable = true;
                dataGridOptions.columns = fullScreenColumns;
                dataGridOptions.gistView = false;
                dataGridOptions.appletConfiguration = defaultConfiguration;
            }

            dataGridOptions.collection = ADK.PatientRecordService.fetchCollection(fetchOptions);

            if (ADK.UserService.hasPermission('add-patient-allergy') && ADK.PatientRecordService.isPatientInPrimaryVista()) {
                dataGridOptions.onClickAdd = function(event) {
                    var addAllergyChannel = ADK.Messaging.getChannel('addAllergy');
                    addAllergyChannel.trigger('addAllergy:clicked', event, gridView);
                };
            }

            dataGridOptions.collection.on('sync', function() {
                //dataGridOptions.collection.comparator = 'acuityName';
                dataGridOptions.collection.comparator = function(a, b) {
                    var acuityNameA = a.get('acuityName') || '';
                    var acuityNameB = b.get('acuityName') || '';
                    if (acuityNameB.localeCompare(acuityNameA) !== 0) {
                        return acuityNameB.localeCompare(acuityNameA);
                    } else {
                        var enteredA = a.get('entered') || '';
                        var enteredB = b.get('entered') || '';
                        return enteredB.localeCompare(enteredA);
                    }
                };
                dataGridOptions.collection.sort();
            });
            //Row click event handler
            dataGridOptions.onClickRow = showModal;

            this.dataGridOptions = dataGridOptions;
            gridView = this;
            _super.initialize.apply(this, arguments);
        },
        onRender: function() {
            _super.onRender.apply(this, arguments);
        }
    });

    // expose detail view through messaging
    var searchAppletChannel = ADK.Messaging.getChannel("allergy_grid");
    searchAppletChannel.on('getDetailView', function(params) {
        showModal(params.model);
    });
    var channel = ADK.Messaging.getChannel('allergy_grid');
    channel.reply('detailView', function(params) {
        var fetchOptions = {
            criteria: {
                "uid": params.uid
            },
            patient: new Backbone.Model({
                icn: params.patient.icn,
                pid: params.patient.pid
            }),
            resourceTitle: 'patient-record-allergy',
            viewModel: viewParseModel
        };

        var response = $.Deferred();

        var data = ADK.PatientRecordService.fetchCollection(fetchOptions),
            pidSiteCode,
            detailModel;
        data.on('sync', function() {
            detailModel = data.first();
            var siteCode = ADK.UserService.getUserSession().get('site'),
                pidSiteCode = detailModel.get('pid') ? detailModel.get('pid').split(';')[0] : '';
            response.resolve({
                view: new ModalView({
                    model: detailModel,
                    collection: data
                }),
                title: Util.getModalTitle(detailModel),
                modalSize: "medium",
                footerView: Backbone.Marionette.ItemView.extend({
                    template: detailsFooterTemplate,
                    onRender: function() {},
                    events: {
                        'click #error': 'enteredInError'
                    },
                    enteredInError: function(event) {
                        var allergyEnteredInErrorChannel = ADK.Messaging.getChannel('allergyEiE');
                        allergyEnteredInErrorChannel.trigger('allergyEiE:clicked', event, model, gridView);
                    },
                    templateHelpers: function() {
                        if (ADK.UserService.hasPermission('remove-patient-allergy') && pidSiteCode === siteCode) {
                            return {
                                data: true
                            };
                        } else {
                            return {
                                data: false
                            };
                        }
                    }
                })
            });
        }, this);

        return response.promise();
    });

    var GistView = ADK.AppletViews.PillsGistView.extend({
        className: 'app-size',
        initialize: function(options) {
            var self = this;
            this._super = ADK.AppletViews.PillsGistView.prototype;
            this.appletOptions = {
                gistModel: gistModel,
                collection: ADK.PatientRecordService.fetchCollection(fetchOptions)
            };
            this._super.initialize.apply(this, arguments);
        }
    });

    var applet = {
        id: 'allergy_grid',
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
        defaultViewType: "summary"
    };

    return applet;
});
