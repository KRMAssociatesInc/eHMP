define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/problems/modalView/footerTemplate'
], function(Backbone, Marionette, _, FooterTemplate) {
    'use strict';

    var problemChannel = ADK.Messaging.getChannel('problem-add-edit');

    //Modal Navigation Item View
    return Backbone.Marionette.ItemView.extend({
        events: {
            'click #deleteBtn': 'deleteProblem',
            'click #editBtn': 'editProblem'
        },
        deleteProblem : function(event){
            problemChannel.command('openProblemDelete', 'problem_delete', this.model);
        },
        editProblem: function(){
            problemChannel.command('openProblemEdit', 'problem_edit', this.model);
        },

        template: FooterTemplate

    });

});
