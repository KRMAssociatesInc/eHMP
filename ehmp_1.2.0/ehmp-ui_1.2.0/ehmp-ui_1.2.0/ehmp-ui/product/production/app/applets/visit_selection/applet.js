define([
    "hbs!app/applets/visit_selection/main"
], function(mainTemplate){

    var visitChannel = ADK.Messaging.getChannel('visit');
    visitChannel.on('set-visit-success:visit_select', updateView);
    var viewInstance;

    var AppletView = Backbone.Marionette.ItemView.extend({
        model: ADK.PatientRecordService.getCurrentPatient(),
        template: mainTemplate,
        initialize: function(){
            viewInstance = this;
        },
        events: {
            'click #visitSelectBtn': 'selectVisit'
        },
        updateView: function(){
            this.model = ADK.PatientRecordService.getCurrentPatient();
            this.render();
        },
        selectVisit: function(){
            visitChannel.command('openVisitSelector', 'visit_select');
        }
    });

    function updateView(){
        if(viewInstance){
            viewInstance.updateView();
        }
    }

    var applet = {
        id: "visit_selection",
        getRootView: function(){
            return AppletView;
        }
    };

    return applet;
});
