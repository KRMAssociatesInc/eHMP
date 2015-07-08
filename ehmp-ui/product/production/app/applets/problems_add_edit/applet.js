define([], function(){

    var problemChannel = ADK.Messaging.getChannel('problem-add-edit');

    var AppletView = Backbone.Marionette.ItemView.extend({
        template: _.template(
            '<button id="searchBtn" class="btn btn-primary" data-toggle="modal" data-target="#mainModal">Add Problem</button>' +
            '<button id="editBtn" class="btn btn-primary" data-toggle="modal" data-target="#mainModal">Edit Problem</button>' +
            '<button id="deleteBtn" class="btn btn-primary" data-toggle="modal" data-target="#mainModal" data-text="Occasional, uncontrolled chest pain (ICD-9-CM 411.1)">Delete Problem</button>'
        ),
        events: {
            "click #searchBtn": 'popSearch',
            'click #deleteBtn': 'popDelete'
        },
        popSearch: function(){
            problemChannel.command('openProblemSearch', 'problem_search');
        },
        popDelete: function() {
            // add params
            problemChannel.command('openProblemDelete', 'problem_delete',
                { uid : 'urn:va:problem:DOD:0000000001:1000000063' }
            );
        }
    });

    var applet = {
        id: "problems_add_edit",
        getRootView: function(){
            return AppletView;
        }
    };

    return applet;
});
