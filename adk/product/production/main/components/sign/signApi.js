define([
    'backbone',
    'marionette',
    'jquery',
    'underscore'
], function(Backbone, Marionette, $, _) {
    'use strict';
    var api = {};

    api.sign = function(model,callback) {
        var view = new ADK.Views.SignForm({
            model: model,
            callback: callback
        });
        var footer = view.getFooterView(model);
        var header = view.getHeaderView(model);
        var modalOptions = {
            title: 'Sign',
            'size': "large",
            'backdrop': true,
            'keyboard': true,
            'callShow': true,
            headerView: header,
            footerView: footer
        };
        var modal = new ADK.UI.Modal({
            view: view,
            options: modalOptions
        });
        modal.show();
    };
    return api;
});