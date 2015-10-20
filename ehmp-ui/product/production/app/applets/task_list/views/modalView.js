define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/task_list/eventHandler',
    'hbs!app/applets/task_list/templates/modalTemplate',
], function(Backbone, Marionette, _, EventHandler, ModalTemplate) {



    return Backbone.Marionette.ItemView.extend({
        template: ModalTemplate,
        events: {
            'click button': 'onButtonClick'
        },
        onButtonClick: function(ev){
            EventHandler.modalButtonsOnClick.call(this, ev);
        }
    });

    //end of function
});