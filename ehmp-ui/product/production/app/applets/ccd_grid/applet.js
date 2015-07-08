define([
    'backbone',
    'marionette',
    'app/applets/ccd_grid/util',
    'app/applets/ccd_grid/modal/modalView',
    'app/applets/ccd_grid/modal/modalHeaderView',
    'hbs!app/applets/ccd_grid/list/dateCellTemplate',
    'hbs!app/applets/ccd_grid/list/dateTimeCellTemplate'
], function(Backbone, Marionette, Util, ModalView, modalHeader, dateTemplate, dateTimeTemplate) {

    'use strict';
    //Data Grid Columns
    var dateTimeCol = {
        name: 'referenceDateTimeDisplay',
        label: 'Date',
        cell: 'string',
        sortValue: function(model, sortKey) {
            return model.get("referenceDateTime");
        },
        hoverTip: 'chs_date'
    };
    var dateCol = {
        name: 'referenceDateDisplay',
        label: 'Date',
        cell: 'string',
        sortValue: function(model, sortKey) {
            return model.get("referenceDateTime");
        },
        hoverTip: 'chs_date'
    };
    var authorCol = {
        name: 'authorDisplayName',
        label: 'Authoring Institution',
        cell: 'string',
        hoverTip: 'chs_authoringinstitution'
    };
    var descCol = {
        name: 'summary',
        label: 'Description',
        cell: 'string',
        hoverTip: 'chs_description'
    };
    var summaryColumns = [dateCol, authorCol];

    //    var fullScreenColumns = summaryColumns.slice(0);

    var fullScreenColumns = [dateTimeCol, descCol, authorCol];

    var viewParseModel = {
        parse: function(response) {
            if (response.kind == "C32 Document") {
                if (response.name) {
                    response.localTitle = response.name;
                }
                if (response.creationTime) {
                    response.referenceDateTime = response.creationTime;
                } else if (response.dateTime) {
                    response.referenceDateTime = response.dateTime;
                }
                response.referenceDateDisplay = ADK.utils.formatDate(response.referenceDateTime);
                if (response.referenceDateDisplay === '') {
                    response.referenceDateDisplay = 'N/A';
                }

                response.referenceDateTimeDisplay = ADK.utils.formatDate(response.referenceDateTime, 'MM/DD/YYYY - HH:mm');
                if (response.referenceDateTimeDisplay === '') {
                    response.referenceDateTimeDisplay = 'N/A';
                }

                if (response.authorList) {
                    if (response.authorList.length > 0) {
                        if (response.authorList[0].institution) {
                            response.authorDisplayName = response.authorList[0].institution;
                        }
                    } else {
                        response.authorDisplayName = "N/A";
                    }
                }
                response.facilityName = "VLER";
            }
            return response;
        }
    };

    //Collection fetchOptions
    var fetchOptions = {
        resourceTitle: 'patient-record-vlerdocument',
        pageable: true,
        viewModel: viewParseModel,
        cache: true,
        criteria: {
            callType : 'vler_list'
        }
    };

    var _super;
    var GridApplet = ADK.Applets.BaseGridApplet;

    var AppletLayoutView = GridApplet.extend({
        initialize: function(options) {
            _super = GridApplet.prototype;
            var dataGridOptions = {};
            dataGridOptions.filterEnabled = true; //Defaults to true
            //dataGridOptions.filterFields = ['summary']; //Defaults to all columns
            if (this.columnsViewType === "summary") {
                dataGridOptions.columns = summaryColumns;
            } else if (this.columnsViewType === "expanded") {
                dataGridOptions.columns = fullScreenColumns;
            } else {
                dataGridOptions.summaryColumns = summaryColumns;
                dataGridOptions.fullScreenColumns = fullScreenColumns;
            }
            dataGridOptions.enableModal = true;
            // dataGridOptions.filterDateRangeEnabled = true;
            // dataGridOptions.filterDateRangeField = {
            //     name: "creationTime",
            //     label: "Date",
            //     format: "YYYYMMDD"
            // };

            fetchOptions.onSuccess = function() {
                dataGridOptions.collection.reset(dataGridOptions.collection.models);
            };

            var self = this;
            this.dataGridOptions = dataGridOptions;

            dataGridOptions.collection = ADK.PatientRecordService.fetchCollection(fetchOptions);

            dataGridOptions.onClickRow = function(model, event, gridView) {
                event.preventDefault();
                var view = new ModalView({
                    model: model,
                    target: event.currentTarget,
                    collection: dataGridOptions.collection,
                    initCount: 0
                });

                // view.resetSharedModalDateRangeOptions();
                var modalOptions = {
                    'title': Util.getModalTitle(model),
                    'size': 'xlarge',
                    'headerView': modalHeader.extend({
                        model: model,
                        theView: view,
                        initCount: 0
                    })
                };

                ADK.showModal(view, modalOptions);

            };

            _super.initialize.apply(this, arguments);
            var message = ADK.Messaging.getChannel('ccd_grid');
            message.reply('gridCollection', function() {
                return self.gridCollection;
            });


        },
        onRender: function() {
            _super.onRender.apply(this, arguments);

        }
    });

    var applet = {
        id: "ccd_grid",
        viewTypes: [{
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

    // expose detail view through messaging
    var channel = ADK.Messaging.getChannel(applet.id);
    channel.reply('detailView', function(params) {

        var fetchOptions = {
            criteria: {
                "uid": params.uid
            },
            patient: new Backbone.Model({
                icn: params.patient.icn,
                pid: params.patient.pid
            }),
            resourceTitle: 'patient-record-vlerdocument',
            viewModel: viewParseModel
        };

        var response = $.Deferred();

        var data = ADK.PatientRecordService.fetchCollection(fetchOptions);
        data.on('sync', function() {
            var detailModel = data.first();
            response.resolve({
                view: new ModalView({
                    model: detailModel
                }),
                title: Util.getModalTitle(detailModel)
            });
        }, this);

        return response.promise();
    });

    return applet;
});

