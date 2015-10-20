define([
    "require",
    "backbone",
    "underscore",
    "app/applets/lab_results_grid/modal/modalView",
    "app/applets/lab_results_grid/modal/errorView",
    "app/applets/lab_results_grid/modal/modalHeaderView"
], function(require, Backbone, _, ModalView, ErrorView, ModalHeaderViewUndef) {
    'use strict';

    var appletUiHelpers = {

		getDetailView: function(model, target, dataCollection, navHeader, onSuccess, onFail) {

            if (!model.get('pathology')) {
                // for non panel lab result row
                model.set('isNotAPanel', true);
                var view = new ModalView({
                    model: model,
                    target: target,
                    gridCollection: dataCollection,
                    isFromNonPanel: true
                });
                var detailData = {
                    view: view,
                    title: model.get('typeName') + ' - ' + model.get('specimen')
                };
                onSuccess(detailData, model, dataCollection, navHeader);

            } else {
                var resultDocs = model.get('results');

                if (resultDocs && resultDocs.length > 0 && resultDocs[0].resultUid) {
                    var uid = resultDocs[0].resultUid;
                    console.log(uid);
                    var currentPatient = ADK.PatientRecordService.getCurrentPatient();
                    var deferredDetailResponse = ADK.Messaging.getChannel("lab_results_grid").request('extDetailView', {
                        uid: uid,
                        patient: {
                            icn: currentPatient.attributes.icn,
                            pid: currentPatient.attributes.pid
                        },
                        suppressModal: true
                    });

                    deferredDetailResponse.done(function(detailData) {
                        onSuccess(detailData, model, dataCollection, navHeader);
                    });
                    deferredDetailResponse.fail(function(error) {
                        onFail(error, model, dataCollection);
                    });
                } else {
                    onFail("Lab has no link to a result document", model, dataCollection);
                }
            }
        },
        showModal: function(detailData, detailModel, dataCollection, navHeader) {
            var modalOptions = {
                'title': detailData.title,
                'size': 'large'
            };

            detailModel.set('lab_detail_title', detailData.title);

            if (navHeader) {
                var ModalHeaderView = require('app/applets/lab_results_grid/modal/modalHeaderView');
                modalOptions.headerView = ModalHeaderView.extend({
                    model: detailModel,
                    theView: detailData.view,
                    dataCollection: dataCollection,
                    navHeader: navHeader
                });
            }

            var modal = new ADK.UI.Modal({
                view: detailData.view,
                options: modalOptions
            });
            modal.show();
        },
        showErrorModal: function(error, itemModel, dataCollection) {
            var modalOptions = {
                'title': "An Error Occurred",
                'size': 'large'
            };

            var errorMsg = _.isString(error) ? error : error && _.isString(error.statusText) ? error.statusText : "An error occurred";
            var errorView = new ErrorView({
                model: new Backbone.Model({ error: errorMsg })
            });

            var ModalHeaderView = require('app/applets/lab_results_grid/modal/modalHeaderView');
            modalOptions.headerView = ModalHeaderView.extend({
                model: itemModel,
                theView: errorView,
                dataCollection: dataCollection,
                navHeader: true
            });

            var modal = new ADK.UI.Modal({
                view: errorView,
                options: modalOptions
            });
            modal.show();
        }
    };
    return appletUiHelpers;
});
