define([
    "backbone",
    "marionette",
    "underscore",
    "app/applets/progress_notes/summary/singleRowModal/singleRowModalView",
    "hbs!app/applets/progress_notes/summary/row"
], function(Backbone, Marionette, _, ModalView, summaryRowTemplate) {


    return Backbone.Marionette.ItemView.extend({
        tagName: "tr",
        template: summaryRowTemplate,
        events: {
            'click td': 'showModal'
        },
        showModal: function(event) {
            event.preventDefault();
            var view = new ModalView();
            view.model = this.model;
            console.log(view.model);

            ADK.showModal(view);
        }
    });

});
