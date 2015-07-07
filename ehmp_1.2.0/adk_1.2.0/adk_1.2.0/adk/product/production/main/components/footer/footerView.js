define([
    'backbone',
    'marionette',
    'underscore',
    'moment',
    'api/Messaging',
    'hbs!main/components/footer/footerTemplate',
    'main/components/footer/patientSyncStatusView'
], function(Backbone, Marionette, _, moment, Messaging, footerTemplate, PatientSyncStatusView) {

    var FooterView = Backbone.Marionette.LayoutView.extend({
        template: footerTemplate,
        initialize: function(options) {
            this.model = new Backbone.Model();
            this.model.set(Messaging.request('appManifest').attributes);
            if (options.currentScreen){
                this.model.set('currentScreen', options.currentScreen);
                this.options = options;
            }
        },
        modelEvents: {
            'change:currentScreen': 'updatePatientSyncStatus',
        },
        onBeforeShow: function() {
            this.showChildView('patientSyncStatusRegion', new PatientSyncStatusView(this.options));
        },
        onShow: function(){
            this.updatePatientSyncStatus();
        },
        updatePatientSyncStatus: function(){
            if (this.model.get('currentScreen').patientRequired === true) {
                this.patientSyncStatusRegion.currentView.fetchDataStatus();
                console.log('ADK patient required is true.');
                var curView = this.patientSyncStatusRegion.currentView;
                // this.patientSyncStatusRegion.currentView.fetchDataStatus();
                curView.fetchDataStatus(true);
            } else {
                this.patientSyncStatusRegion.currentView.model.unset('syncStatus');
            }
        },
        regions: {
            patientSyncStatusRegion: '#patientSyncStatusRegion'
        },
        className: 'col-md-12 navbar-fixed-bottom',
    });
    return FooterView;
});