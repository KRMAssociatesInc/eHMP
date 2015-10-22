define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/task_list/eventHandler',
    'app/applets/task_list/views/modalView'
], function(Backbone, Marionette, _, EventHandler, ModalView) {

    var TaskModel = Backbone.Model.extend({
        defaults: {
            name: 'Generic Name',
            assignedDate: '2015-05-01',
            dueDate: '2015-05-19',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer pulvinar blandit odio vel auctor. Sed pretium nisi nulla, sit amet malesuada mauris dapibus vel. Morbi ornare mauris eget iaculis pulvinar. Curabitur ut eleifend erat, id suscipit turpis. Ut aliquam lacinia sapien. Pellentesque dapibus turpis vel semper vulputate. Vestibulum ac iaculis elit. Vivamus euismod mauris sed tellus posuere pretium. In sapien sapien, egestas ac lectus a, feugiat elementum ex. Morbi quis porttitor ex, in ultrices nisi. Phasellus at risus ante. In viverra nec ex nec molestie. Proin rhoncus nibh odio. In ut est a turpis accumsan pretium. Sed aliquam maximus dictum.',
            assignedTo: 'Nurse Jackie',
            status: 'In Progress'
        }
    });

    var TaskCollection = Backbone.PageableCollection.extend({
        model: TaskModel,
        mode: 'client',
        state: {
            pageSize: 10
        }
    });

    var columns = [{
        name: 'name',
        label: 'Task Name',
        cell: 'string'
    }, {
        name: 'assignedDate',
        label: 'Date Assigned',
        cell: 'date'
    }, {
        name: 'dueDate',
        label: 'Date Due',
        cell: 'date'
    }, {
        name: 'description',
        label: 'Description',
        cell: 'string'
    }, {
        name: 'assignedTo',
        label: 'Assigned To',
        cell: 'string'
    }, {
        name: 'status',
        label: 'Status',
        cell: 'string'
    }];

    var taskCollection = new TaskCollection();

    var index = 0;
    for (; index < 20; index++) {
        taskCollection.add({});
    }

    return ADK.AppletViews.GridView.extend({
        _super: ADK.AppletViews.GridView.prototype,
        initialize: function(options) {
            this.appletOptions = {
                columns: columns,
                collection: taskCollection,
                filterFields: ['name', 'assignedTo', 'description', 'status'],
                onClickRow: this.onClickRow
            };

            this._super.initialize.apply(this, arguments);
            //end of initialize
        },
        onRender: function() {
            this._super.onRender.apply(this, arguments);
            taskCollection.trigger('sync');
        },
        onClickRow: function(model, event) {
            EventHandler.taskListViewOnClickRow.call(this, model, event, ModalView);
        }


        // end of ADK.GridView.extend
    });

    //end of function
});