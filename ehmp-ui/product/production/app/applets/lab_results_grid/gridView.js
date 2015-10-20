define([
    "backbone",
    "marionette",
    'underscore',
    "app/applets/lab_results_grid/appletHelpers",
    "app/applets/lab_results_grid/appletUiHelpers",
    "app/applets/lab_results_grid/details/detailsView",
    "app/applets/lab_results_grid/modal/modalView",
    "app/applets/lab_results_grid/meta/columns",
    "hbs!app/applets/lab_results_grid/templates/tooltip",
    'app/applets/orders/writeback/addOrders',
    'app/applets/visit_new/writeback/addselectVisit'
], function(Backbone, Marionette, _, AppletHelper, AppletUiHelper, DetailsView, ModalView, columns, tooltip, addOrders, addselectVisit) {


    var fetchOptions = {
        resourceTitle: 'patient-record-labsbypanel',
        pageable: true,
        cache: false,
        viewModel: {
            parse: function(response) {
                // Check 'codes' for LOINC codes and Standard test name.
                var lCodes = [];
                var testNames = [];
                if (response.codes) {
                    response.codes.forEach(function(code) {
                        if (code.system.indexOf("loinc") != -1) {
                            lCodes.push(" " + code.code);
                            testNames.push(" " + code.display);
                        }
                    });
                }
                response.loinc = lCodes;
                response.stdTestNames = testNames;

                var low = response.low,
                    high = response.high;

                if (low && high) {
                    response.referenceRange = low + '-' + high;
                }

                if (response.interpretationCode) {
                    var temp = response.interpretationCode.split(":").pop();

                    var flagTooltip = "";
                    var labelClass = "label-danger";

                    if (temp === "HH") {
                        temp = "H*";
                        flagTooltip = "Critical High";
                    }
                    if (temp === "LL") {
                        temp = "L*";
                        flagTooltip = "Critical Low";
                    }
                    if (temp === "H") {
                        flagTooltip = "Abnormal High";
                        labelClass = "label-warning";
                    }
                    if (temp === "L") {
                        flagTooltip = "Abnormal Low";
                        labelClass = "label-warning";
                    }
                    response.interpretationCode = temp;
                    response.flagTooltip = flagTooltip;
                    response.labelClass = labelClass;
                }

                if (response.categoryCode) {
                    var categoryCode = response.categoryCode.slice(response.categoryCode.lastIndexOf(':') + 1);

                    switch (categoryCode) {
                        case 'EM':
                        case 'MI':
                        case 'SP':
                        case 'CY':
                        case 'AP':
                            response.result = 'View Report';
                            if (!response.typeName) {
                                response.typeName = response.categoryName;
                            }
                            response.pathology = true;
                            break;
                    }
                }
                return response;
            }
        }
    };

    var InAPanelModel = Backbone.Model.extend({
        parse: fetchOptions.viewModel.parse
    });

    var PanelModel = Backbone.Model.extend({
        defaults: {
            type: 'panel'
        }
    });
    var gridView;
    return ADK.AppletViews.GridView.extend({
        initialize: function(options) {
            this._super = ADK.AppletViews.GridView.prototype;

            this.summaryColumns = [columns.dateCol(), columns.testCol(), columns.flagCol(), columns.resultAndUnitCol()];
            this.fullScreenColumns = [columns.dateCol(), columns.testCol(), columns.flagCol(), columns.resultNoUnitCol(), columns.unitCol(), columns.refCol(), columns.facilityCol()];

            var getLoincValues = function(json) {
                if (json.codes === undefined) return '';
                var codesWithLoinc = _.filter(json.codes, function(item) { return item.system === 'http://loinc.org'; });
                return _.pluck(codesWithLoinc, 'code').join(' ');
            };

            var appletOptions = {
                filterFields: ['observed', 'typeName', 'flag', 'result', 'specimen', 'groupName', 'isPanel', 'units', 'referenceRange', 'facilityMoniker', 'labs.models', getLoincValues ],
                formattedFilterFields: {
                    'observed': function(model, key) {
                        var val = model.get(key);
                        val = val.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$2/$3/$1 $4:$5');
                        return val;
                    }
                },
                DetailsView: DetailsView,
                filterDateRangeField: {
                    name: "observed",
                    label: "Date",
                    format: "YYYYMMDD"
                },

                 onClickAdd: function(e) {
                    // var addOrdersChannel = ADK.Messaging.getChannel('addALabOrdersRequestChannel');
                    //  //addOrdersChannel.trigger('addLabOrdersModal', event, gridView);
                    //  addOrdersChannel.command('openOrdersSearch');
                    e.preventDefault();
                    var writebackView = ADK.utils.appletUtils.getAppletView('orders', 'writeback');
                    var formModel = new Backbone.Model();
                    var vm_formModel = new Backbone.Model({
                        encounterProvider: 'Not Specified',
                        encounterLocation: 'Not Specified',
                        visit: {}
                    });
                    var workflowOptions = {
                        size: "large",
                        title: "Order a Lab Test",
                        showProgress: false,
                        keyboard: true,
                        steps: []
                    };

                    //check if visit context is already set
                    var visit = ADK.PatientRecordService.getCurrentPatient().get('visit');
                    //console.log(visit);
                    if (!visit) {
                        workflowOptions.steps.push({
                            view: addselectVisit,
                            viewModel: vm_formModel
                        });
                    }
                    workflowOptions.steps.push({
                        view: addOrders,
                        viewModel: formModel
                    });
                    var workflowView = new ADK.UI.Workflow(workflowOptions);
                    workflowView.show();
                },
                onClickRow: function(model, event, gridView) {
                    event.preventDefault();
                    if (model.get('isPanel')) {
                        if (!$(event.currentTarget).data('isOpen')) {
                            $(event.currentTarget).data('isOpen', true);
                        } else {
                            var k = $(event.currentTarget).data('isOpen');
                            k = !k;
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
                        AppletUiHelper.getDetailView(model, event.currentTarget, appletOptions.collection, true, AppletUiHelper.showModal, AppletUiHelper.showErrorModal);
                    }
                },
                tblRowSelector : "#data-grid-lab_results_grid tbody tr"
            };
            if (this.columnsViewType === "expanded") {
                appletOptions.columns = this.fullScreenColumns;
            } else if (this.columnsViewType === "summary") {
                appletOptions.columns = this.summaryColumns;
            } else {
                appletOptions.summaryColumns = this.summaryColumns;
                appletOptions.fullScreenColumns = this.fullScreenColumns;
            }

            var self = this;

            fetchOptions.onSuccess = function(collection) {
                var fullCollection = collection.fullCollection || collection;

                fullCollection.each(function(result) {
                    result.set('infobuttonContext', 'LABRREV');
                    var resultAttributes = _.values(result.attributes);
                    if (typeof resultAttributes[0][0] === 'object') {
                        var currentPanel = resultAttributes[0],
                            currentPanelFirstLab = currentPanel[0],
                            panelGroupName = _.keys(result.attributes)[0],
                            group = panelGroupName,
                            id = group.replace(/\s/g, ''),
                            tempCode = "",
                            tempTooltip = "",
                            labelClass = "";

                        _.each(currentPanel, function(lab, i) {
                            lab = new InAPanelModel(InAPanelModel.prototype.parse(lab));

                            if (lab.attributes.interpretationCode == "H*") {
                                tempCode = "H*";
                                tempTooltip = "Critical High";
                                labelClass = "label-danger";

                            } else if (lab.attributes.interpretationCode == "L*") {
                                if (tempCode == "H" || tempCode == "L" || tempCode === "") {
                                    tempCode = "L*";
                                    tempTooltip = "Critical Low";
                                    labelClass = "label-danger";
                                }
                            } else if (lab.attributes.interpretationCode == "H") {
                                if (tempCode == "L" || tempCode === "") {
                                    tempCode = "H";
                                    tempTooltip = "Abnormal High";
                                    labelClass = "label-warning";
                                }
                            } else if (lab.attributes.interpretationCode == "L") {
                                if (tempCode === "") {
                                    tempCode = "L";
                                    tempTooltip = "Abnormal Low";
                                    labelClass = "label-warning";
                                }
                            }
                            currentPanel[i] = lab;
                        });

                        var tempUid = panelGroupName.replace(/\s/g, '') + "_" + currentPanelFirstLab.groupUid.replace(/\s/g, '');
                        tempUid = tempUid.replace('#', '');

                        result.set({
                            labs: new Backbone.Collection(currentPanel),
                            observed: currentPanelFirstLab.observed,
                            isPanel: 'Panel',
                            typeName: group,
                            panelGroupName: panelGroupName,
                            facilityCode: currentPanelFirstLab.facilityCode,
                            facilityMoniker: currentPanelFirstLab.facilityMoniker,
                            interpretationCode: tempCode,
                            flagTooltip: tempTooltip,
                            labelClass: labelClass,
                            uid: tempUid,
                            type: 'panel'
                        });
                    }
                });

                var sortedModels = _.sortBy(fullCollection.models, function(lab) {
                    return -(lab.attributes.observed);
                });

                fullCollection.reset(sortedModels);
                if (appletOptions.appletConfig.viewType === "expanded") {
                    appletOptions.collection.setPageSize(fullCollection.length);
                }

            };
            fetchOptions.criteria = {
                filter: this.buildJdsDateFilter('observed')
            };

            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
                self.dateRangeRefresh('observed');
            });

            this.gridCollection = ADK.PatientRecordService.fetchCollection(fetchOptions);
            appletOptions.collection = this.gridCollection;

            this.appletOptions = appletOptions;
            this._super.initialize.apply(this, arguments);

            var message = ADK.Messaging.getChannel('lab_results');
            message.reply('gridCollection', function() {
                return self.gridCollection;
            });

        }
    });
});
