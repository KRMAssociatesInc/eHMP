define([
], function() {

    var eventHandler = {
        modalButtonsOnClick: function(ev) {
            ev.preventDefault();
        },
        taskListViewOnClickRow: function(model, event, ModalView) {
            var modal = new ADK.UI.Modal({
                view: new ModalView({
                    model: model,
                    navHeader: false
                }),
                options: {
                    size: "large",
                    title: 'Task - ' + model.get('name')
                }
            });
            modal.show();

        }
    };

    return eventHandler;
});