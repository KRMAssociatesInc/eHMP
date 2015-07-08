define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/views/globalErrorTemplate",
    'main/ADK'
], function(Backbone, Marionette, _, globalErrorTemplate, ADK) {
    var Error = Backbone.Model.extend({
        defaults: {
            errormsg: 'Server timed out',
            prefix: 'Error'
        }
    });

    var ErrorView = Backbone.Marionette.ItemView.extend({
        template: globalErrorTemplate,
        model: new Error(),
        events: {
            'click #reloadPage': 'reloadPage'
        },
        reloadPage: function (){
            if (this.clearSession === true){
                ADK.SessionStorage.delete.all();
            }
            window.location.reload();
        },
        initialize: function(options){
            if (options.refreshButton){
                this.model.set('refreshButton', options.refreshButton);
            }
            if (options.clearSession === true){
                this.clearSession = true;
            }
            this.model.set('errormsg', options.errorMessage);
        },
        tagName: 'div',
    });


    return ErrorView;
});
