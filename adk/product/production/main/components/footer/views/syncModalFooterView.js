define([
    'backbone',
    'marionette',
    'underscore'
], function(Backbone, Marionette, _){
    return {
        getFooterView: function(ModalViewInstance, PatientSyncStatusView){
            return Backbone.Marionette.ItemView.extend({
                template: _.template('<div class="pull-left"><button id="sync-all-sources" class="btn btn-default">Sync All Sources to VX</button><button id="sync-refresh-all" class="btn btn-default">Refresh All Data</button></div><button id="sync-modal-close" class="btn btn-default pull-right" data-dismiss="modal">Close</button>'),
                events: {
                    'click #sync-all-sources': 'syncAllSources',
                    'click #sync-refresh-all': 'refreshAll'
                },
                refreshAll: function(){
                    PatientSyncStatusView.refreshStatus();
                },
                syncAllSources: function(){
                    ModalViewInstance.forceSyncAll();
                }
            });
        }
    };
});