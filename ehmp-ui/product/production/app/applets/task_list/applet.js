define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/task_list/views/taskListView'
], function(Backbone, Marionette, _, TaskListView) {

    var applet = {
        id: 'task_list',
        getRootView: function(viewTypeOption) {
            return ADK.Views.AppletControllerView.extend({
                viewType: viewTypeOption
            });
        },
        viewTypes: [{
            type: 'expanded',
            view: TaskListView,
            chromeEnabled: true
        }],

        defaultViewType: 'expanded'
    };



    return applet;
});