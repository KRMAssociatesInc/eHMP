define([
    "require",
    "backbone",
    "underscore",
    "app/applets/vista_health_summaries/modal/modalView",
    "app/applets/vista_health_summaries/modal/errorView",
    "app/applets/vista_health_summaries/modal/modalHeaderView"
], function(require, Backbone, _, ModalView, ErrorView, ModalHeaderViewUndef) {
    'use strict';

    var appletUiHelpers = {
        getDetailView: function(model, target, dataCollection, navHeader, onSuccess, onFail) {
            var view = new ModalView({
                model: model,
                target: target,
                gridCollection: dataCollection
            });
            onSuccess(view, model, dataCollection, navHeader);
        },
        showModal: function(detailView, detailModel, dataCollection, navHeader) {
            var modalOptions = {
                'title': detailModel.get('facilityMoniker') + ' - ' + detailModel.get('hsReport'),
                'size': 'large'
            };

            if (navHeader) {

                // enable/disable previous and next buttons.
                var index = _.indexOf(dataCollection.models, detailModel),
                    next = index + 1,
                    prev = index - 1,
                    nextButtonDisable = false,
                    prevButtonDisable = false,
                    detailGroupName = $("#" + detailModel.get('uid')).prevAll('tr.groupByHeader:first').find('td.groupByHeader b').text();

                if (next >= dataCollection.length) {
                    nextButtonDisable = true;
                } else {
                    var nextDetailModel = dataCollection.at(next),
                        nextGroupName = $("#" + nextDetailModel.get('uid')).prevAll('tr.groupByHeader:first').find('td.groupByHeader b').text();

                    if (detailGroupName !== nextGroupName) {
                        nextButtonDisable = true;
                    }
                }

                if (prev < 0) {
                    prevButtonDisable = true;
                } else {
                    var prevDetailModel = dataCollection.at(prev),
                        prevGroupName = $("#" + prevDetailModel.get('uid')).prevAll('tr.groupByHeader:first').find('td.groupByHeader b').text();

                    if (detailGroupName !== prevGroupName) {
                        prevButtonDisable = true;
                    }
                }

                var ModalHeaderView = require('app/applets/vista_health_summaries/modal/modalHeaderView');
                modalOptions.headerView = ModalHeaderView.extend({
                    model: detailModel,
                    theView: detailView,
                    dataCollection: dataCollection,
                    navHeader: navHeader,
                    nextButtonDisable: nextButtonDisable,
                    prevButtonDisable: prevButtonDisable
                });
            }

            var modal = new ADK.UI.Modal({
                view: detailView,
                options: modalOptions
            });
            modal.show();
        },
        showErrorModal: function(errorMsg) {
            var modalOptions = {
                'title': "An Error Occurred",
                'size': 'large'
            };
            var modal = new ADK.UI.Modal({
                view: new ErrorView({
                    model: new Backbone.Model({
                        error: errorMsg
                    })
                }),
                options: modalOptions
            });
            modal.show();
        }
    };

    return appletUiHelpers;

});