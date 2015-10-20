define([
    'backbone',
    'app/applets/problems/modalView/modalView',
    'app/applets/problems/modalView/modalHeaderView',
    'app/applets/problems/modalView/modalFooterView',
    'hbs!app/applets/problems/list/severityTemplate',
    'hbs!app/applets/problems/list/commentTemplate',
    'app/applets/problems/util',
    'hbs!app/applets/problems/list/tooltip',
    "app/applets/problems/gistView",
    'app/applets/problems_add_edit/deleteModalView',
], function(Backbone, ModalView, modalHeader, modalFooter, severityTemplate, commentTemplate, Util, tooltip, GistView,DeleteView) {
    'use strict';
    var problemChannel = ADK.Messaging.getChannel('problems');
    var allEncounterDateArray = [];
    //Data Grid Columns
    var summaryColumns = [{
        name: 'problemText',
        label: 'Description',
        cell: 'string',
        hoverTip: 'conditions_description'
    }, {
        name: 'acuityName',
        label: 'Acuity',
        cell: 'handlebars',
        template: severityTemplate,
        hoverTip: 'conditions_acuity'
    }, {
        name: 'statusName',
        label: 'Status',
        cell: 'string',
        hoverTip: 'conditions_status'
    }, ];

    var fullScreenColumns =
        summaryColumns.concat([{
            name: 'onsetFormatted',
            label: 'Onset Date',
            cell: 'string',
            sortValue: function(model, sortKey) {
                return model.get("onset");
            },
            hoverTip: 'conditions_onsetdate'
        }, {
            name: 'updatedFormatted',
            label: 'Last Updated',
            cell: 'string',
            sortValue: function(model, sortKey) {
                return model.get("updated");
            },
            hoverTip: 'conditions_lastupdated'
        }, {
            name: 'providerDisplayName',
            label: 'Provider',
            cell: 'string',
            hoverTip: 'conditions_provider'
        }, {
            name: 'facilityMoniker',
            label: 'Facility',
            cell: 'string',
            hoverTip: 'conditions_facility'
        }, {
            name: '',
            cell: 'handlebars',
            template: commentTemplate
        }]);

    fullScreenColumns.splice(1, 0, {
        name: 'standardizedDescription',
        label: 'Standardized Description',
        cell: 'string',
        hoverTip: 'conditions_standardizeddescription'
    });

    var viewParseModel = {
        parse: function(response) {

            response = Util.getStandardizedDescription(response);
            response = Util.getStatusName(response);
            response = Util.getServiceConnected(response);
            response = Util.getProblemText(response);
            response = Util.getICDCode(response);
            response = Util.getAcuityName(response);
            response = Util.getFacilityColor(response);
            response = Util.getOnsetFormatted(response);
            response = Util.getEnteredFormatted(response);
            response = Util.getUpdatedFormatted(response);
            response = Util.getCommentBubble(response);
            response = Util.getICDName(response);
            response = Util.getTimeSince(response);
            response = Util.getStatusName(response);

            return response;
        }
    };
    //Collection fetchOptions
    var fetchOptions = {
        resourceTitle: 'patient-record-problem',
        pageable: true,
        criteria: {
            filter: 'ne(removed, true)'
        },
        cache: false,
        viewModel: viewParseModel
    };
    var GridApplet = ADK.Applets.BaseGridApplet;
    var AppletLayoutView = GridApplet.extend({
        className: '',
        initialize: function(options) {
            this._super = GridApplet.prototype;
            var dataGridOptions = {};
            dataGridOptions.filterEnabled = true;
            dataGridOptions.enableModal = true;
            dataGridOptions.tblRowSelector = '#data-grid-problems tbody tr';
            //dataGridOptions.filterFields = ['summary']; //Defaults to all columns
            if (this.columnsViewType === "expanded") {
                dataGridOptions.columns = fullScreenColumns;
            } else if (this.columnsViewType === "summary") {
                dataGridOptions.columns = summaryColumns;
            } else {
                dataGridOptions.summaryColumns = summaryColumns;
                dataGridOptions.fullScreenColumns = fullScreenColumns;
            }
            this.fetchOptions = fetchOptions;
            var self = this;
            if (ADK.UserService.hasPermission('add-patient-problem') && ADK.PatientRecordService.isPatientInPrimaryVista()) {
                dataGridOptions.onClickAdd = function() {
                    problemChannel.command('addProblem');
                };
            }
            self.getExposure();
            this.dataGridOptions = dataGridOptions;

            dataGridOptions.collection = ADK.PatientRecordService.fetchCollection(this.fetchOptions);
            dataGridOptions.onClickRow = function(model, event, gridView) {
                model.attributes.exposure = self.exposure;
                var view = new ModalView({
                    model: model,
                    collection: dataGridOptions.collection
                });
                var siteCode = ADK.UserService.getUserSession().get('site'),
                    pidSiteCode = model.get('pid') ? model.get('pid').split(';')[0] : '';
                var modalOptions;
                modalOptions = {
                    'title': Util.getModalTitle(model),
                    'size': 'normal',
                    'headerView': modalHeader.extend({
                        model: model,
                        theView: view
                    }),
                    'footerView': modalFooter.extend({
                        model: model,
                        onRender: function() {
                            this.$el.find('.problemsTooltip').tooltip();
                        },
                        templateHelpers: function() {
                            if ((ADK.UserService.hasPermission('edit-patient-problem') || ADK.UserService.hasPermission('remove-patient-problem')) && pidSiteCode === siteCode) {
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
                };

                var modal = new ADK.UI.Modal({
                    view: view,
                    options: modalOptions
                });
                modal.show();
            };

            dataGridOptions.collection.on('sync', function() {
                dataGridOptions.collection.comparator = function(a, b) {
                    var statusNameA = a.get('statusName') || '';
                    var statusNameB = b.get('statusName') || '';
                    if (statusNameB.localeCompare(statusNameA) !== 0) {
                        return -statusNameB.localeCompare(statusNameA);
                    }
                };
                dataGridOptions.collection.sort();
            });

            this._super.initialize.apply(this, arguments);

            // add model to list after writeback.
            problemChannel.comply('addProblemListModel', this.handleAddProblemModel, this);
        },
        handleAddProblemModel: function(appletKey, addedProblemModel) {
            //this.dataGridOptions.collection.push(addedProblemModel);
        },
        exposure: '',
        getExposure: function() {
            var self = this;
            var demographics = ADK.PatientRecordService.fetchCollection({
                resourceTitle: "patient-record-patient",
                onSuccess: function() {
                    if (demographics.models && demographics.models[0] && demographics.models[0].attributes) {
                        var exposure = demographics.models[0].attributes.exposure || [];
                        self.exposure = Util.parseExposure(exposure);
                    }
                }
            });
        }
    });

    // expose detail view through messaging
    var channel = ADK.Messaging.getChannel('problems');
    channel.reply('detailView', function(params) {
        var fetchOptions = {
            criteria: {
                "uid": params.uid
            },
            patient: new Backbone.Model({
                icn: params.patient.icn,
                pid: params.patient.pid
            }),
            resourceTitle: 'patient-record-problem',
            viewModel: viewParseModel
        };

        var response = $.Deferred();

        var data = ADK.PatientRecordService.fetchCollection(fetchOptions);
        data.on('sync', function() {
            var detailModel = data.first();
            var siteCode = ADK.UserService.getUserSession().get('site'),
                pidSiteCode = detailModel.get('pid') ? detailModel.get('pid').split(';')[0] : '';
            response.resolve({
                view: new ModalView({
                    model: detailModel,
                    collection: data
                }),
                title: Util.getModalTitle(detailModel),
                footerView: modalFooter.extend({
                    model: detailModel,
                    onRender: function() {
                        this.$el.find('.problemsTooltip').tooltip();
                    },
                    templateHelpers: function() {
                        if ((ADK.UserService.hasPermission('edit-patient-problem') || ADK.UserService.hasPermission('remove-patient-problem')) && pidSiteCode === siteCode) {
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

    var applet = {
        id: 'problems',
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
