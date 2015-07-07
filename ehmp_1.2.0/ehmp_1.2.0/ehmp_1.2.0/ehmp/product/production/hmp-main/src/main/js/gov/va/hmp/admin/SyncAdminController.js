/**
 * Controls behavior of {@link gov.va.hmp.admin.SyncAdminPanel} and {@link gov.va.hmp.admin.StatsPanel}
 */
Ext.define('gov.va.hmp.admin.SyncAdminController', {
    extend:'gov.va.hmp.Controller',
    requires: [
        'gov.va.hmp.EventBus',
        'gov.va.hmp.ux.Alert'
    ],
    refs:[
        {
            ref:'vprMessages',
            selector:'#messages'
        },
        {
            ref:'odcMessages',
            selector:'#odcMessages'
        },
        {
            ref:'autoUpdateToggleButton',
            selector:'#autoUpdateToggle'
        },
        {
            ref:'operationalDomainField',
            selector: '#operationalDomainField'
        },
        {
            ref:'syncForm',
            selector:'#syncForm'
        },
        {
            ref:'rosterField',
            selector:'#rosterField'
        },
        {
            ref:'teamField',
            selector:'#teamField'
        },
        {
            ref:'clearForm',
            selector:'#clearForm'
        },
        {
            ref:'reindexForm',
            selector:'#reindexForm'
        },
        {
        	ref:'syncErrorGrid',
        	selector:'#syncErrorGrid'
        }
    ],
    init:function () {
//        console.log(Ext.getClassName(this) + ".init()");
        var me = this;

        me.control({
            '#cancelPending': {
                click:me.cancelPending
            },
            '#autoUpdateToggle': {
                click:me.toggleAutoUpdates
            },
            '#syncAllOperationalDataButton': {
                click:me.syncAllOperationalData
            },
            '#syncOperationalDataButton': {
                click:me.syncOperationalData
            },
            '#syncRosterButton':{
                click:me.syncRoster
            },
            '#syncTeamButton':{
                click:me.syncTeam
            },
            '#syncPatientButton':{
                click:me.syncPatient
            },
            '#clearAllSyncErrorsButton':{
                click:me.clearAllSyncErrors
            },
            '#clearAllPatientsButton':{
                click:function () {
                    Ext.Msg.confirm('Unload All Patients', 'Are you sure you want to unload all patients from the VPR?', me.clearAllPatients, me);
                }
            },
            '#clearPatientButton':{
                click:function () {
                    var form = me.getClearForm().getForm();
                    var vals = form.getValues();
                    var pid = null;
                    var valid = (
                        (vals['pid'] && vals['pid'].length > 0) ||
                            (vals['icn'] && vals['icn'].length > 0) ||
                            ((vals['dfn'] && vals['dfn'].length > 0))
                        );
                    if (!valid) {
                        Ext.Msg.alert('Unload Patient', 'No patient specified. Please supply a DFN, an ICN, or a VPR PID to unload from the VPR.');
                    } else {
                        Ext.Msg.confirm('Unload Patient', 'Are you sure you want to unload this patient from the VPR?', me.clearPatient, me);
                    }
                }
            },
            '#reindexPatientButton':{
                click:me.reindexPatient
            },
            '#reindexAllButton':{
                click:me.reindexAllPatients
            },
//            '#errorSearchText':{
//            	blur:me.onErrorSearchTextBlur
//            },
            '#SearchNowButton': {
                click:me.onErrorSearch
            },
            '#errorWarningCheckbox':{
            	select:me.onErrorWarningCheckboxSelect
            }
        });
    },
    onLaunch:function() {
        Ext.getStore('statsStore').on('load', this.onLoad, this);
        gov.va.hmp.EventBus.on('clearsyncerrors', this.clearAllSyncErrors, this);
    },
    /**
     * @private
     */
    onLoad:function(store, records, successful) {
        var autoUpdates = store.findRecord('name', 'Automatic Updates');
        if (autoUpdates) {
            if (autoUpdates.get('value') == 'Disabled') {
                this.getAutoUpdateToggleButton().setText("Enable " + autoUpdates.get('name'));
            } else {
                this.getAutoUpdateToggleButton().setText("Disable " + autoUpdates.get('name'));
            }
        }
    },
    toggleAutoUpdates:function () {
        var me = this;
        Ext.Ajax.request({
            url:'/sync/toggleAutoUpdates',
            method:'POST',
            params:{
                format:'json'
            },
            callback: me.onAjaxResponse,
            scope: me
        });
    },
    cancelPending:function () {
        var me = this;
        Ext.Msg.confirm('Cancel Pending Work', 'Are you sure you want to cancel pending work and remove all messages from the work queue?', me.doCancelPending, me);

    },
    doCancelPending:function(btn) {
        if (btn != 'yes') return;

        var me = this;
        Ext.Ajax.request({
            url:'/sync/cancel',
            method:'POST',
            params:{
                format:'json'
            },
            callback: me.onVPRAjaxResponse,
            scope: me
        });
    },
    syncAllOperationalData:function () {
        var me = this;
        Ext.Ajax.request({
            url:'/sync/loadOperationalData',
            method:'POST',
            params:{
                format:'json'
            },
            callback: me.onODCAjaxResponse,
            scope: me
        });
    },
    syncOperationalData:function () {
        var me = this;
        var domain = me.getOperationalDomainField().getValue();
        Ext.Ajax.request({
            url:'/sync/loadOperationalData',
            method:'POST',
            params:{
                domain: domain,
                format:'json'
            },
            callback: me.onODCAjaxResponse,
            scope: me
        });
    },
    syncTeam:function () {
        var me = this;
        var form = me.getSyncForm().getForm();
        if (form.isValid()) {
        	var fld = me.getTeamField();
        	var val = fld.getValue();
        	var fs = fld.getStore();
        	var rid = 0;
        	for(key in fs.data.items) {
        		if(fs.data.items[key].get("uid")==val) {
        			rid = fs.data.items[key].get("rosterId");
        		}
        	}
            form.submit({
                url:'/sync/loadRosterPatients',
                params:{
                    rosterId:rid
                },
                success: me.onFormSubmitSuccess,
                failure: me.onFormSubmitFailure,
                scope: me
            });
        }
    },
    syncRoster:function () {
        var me = this;
        var form = me.getSyncForm().getForm();
        if (form.isValid()) {
            form.submit({
                url:'/sync/loadRosterPatients',
                params:{
                    uid:me.getRosterField().getValue()
                },
                success: me.onFormSubmitSuccess,
                failure: me.onFormSubmitFailure,
                scope: me
            });
        }
    },
    syncPatient:function () {
        var me = this;
        var form = me.getSyncForm().getForm();
        if (form.isValid()) {
            form.submit({
                url:'/sync/load',
                success: me.onFormSubmitSuccess,
                failure: me.onFormSubmitFailure,
                scope: me
            });
        }
    },
    clearPatient:function (btn) {
        if (btn === "no") return;

        var me = this;
        var form = me.getClearForm().getForm();
        if (form.isValid()) {
            form.url = '/sync/clearPatient';
            form.method = "POST";
            form.submit({
                success: me.onFormSubmitSuccess,
                failure: me.onFormSubmitFailure,
                scope: me
            });
        }
    },
    clearAllSyncErrors:function() {
        var me = this;
        Ext.Msg.confirm('Clear All Sync Errors', 'Are you sure you want to clear all sync errors?', me.doClearAllSyncErrors, me);
    },
    doClearAllSyncErrors:function (btn) {
        if (btn !== "yes") return;

        var me = this;
        Ext.getStore('syncErrors').removeAll();
        Ext.Ajax.request({
            url:'/sync/syncErrors/clear',
            method:'POST',
            params:{
                format:'json'
            },
            callback: me.onAjaxResponse,
            scope: me
        });
    },
    clearAllPatients:function (btn) {
        if (btn !== "yes") return;

        var me = this;
        Ext.Ajax.request({
            url:'/sync/clearAllPatients',
            method:'POST',
            params:{
                format:'json'
            },
            callback: me.onVPRAjaxResponse,
            scope: me
        });
    },
    reindexPatient:function () {
        var me = this;
        var form = me.getReindexForm().getForm();
        if (form.isValid()) {
            form.url = '/sync/reindexPatient';
            form.method = 'POST';
            form.submit({
                success: me.onFormSubmitSuccess,
                failure: me.onFormSubmitFailure,
                scope: me
            });
        }
    },
    reindexAllPatients:function () {
        var me = this;
        var form = me.getReindexForm().getForm();
        if (form.isValid()) {
            form.url = '/sync/reindexAllPatients';
            form.method = 'POST';
            form.submit({
                success: me.onFormSubmitSuccess,
                failure: me.onFormSubmitFailure,
                scope: me
            });
        }
    },
    refreshStats:function () {
        Ext.getStore('statsStore').reload();
    },
    onFormSubmitSuccess:function(form, action) {
        var me = this;
        var alert = gov.va.hmp.ux.Alert.info(action.result.data.message);
        me.getVprMessages().insert(0, alert);
        form.reset();
        me.refreshStats();
    },
    onFormSubmitFailure:function(form, action) {
        var me = this;
        var alert = gov.va.hmp.ux.Alert.error(action.result.message);
        me.getVprMessages().insert(0, alert);
        me.refreshStats();
    },
    // TODO: this is only necessary to put success/error messages in both SyncAdmin and OdcSyncAdmin panels, is there something wrong with the UI?  Maybe we should merge these?
    onAjaxResponse: function(options, success, response) {
        var me = this;
        var json = Ext.JSON.decode(response.responseText);

        var alert1 = success ? gov.va.hmp.ux.Alert.info(json.data.message) : gov.va.hmp.ux.Alert.error(json.error.message);
        var alert2 = success ? gov.va.hmp.ux.Alert.info(json.data.message) : gov.va.hmp.ux.Alert.error(json.error.message);
        me.getVprMessages().insert(0, alert1);
        me.getOdcMessages().insert(0, alert2);

        me.refreshStats();
    },
    onVPRAjaxResponse:function(options, success, response) {
        var me = this;
        var json = Ext.JSON.decode(response.responseText);
        var alert = success ? gov.va.hmp.ux.Alert.info(json.data.message) : gov.va.hmp.ux.Alert.error(json.error.message);
        me.getVprMessages().insert(0, alert);

        me.refreshStats();
    },
    onODCAjaxResponse:function(options, success, response) {
        var me = this;
        var json = Ext.JSON.decode(response.responseText);
        var alert = success ? gov.va.hmp.ux.Alert.info(json.data.message) : gov.va.hmp.ux.Alert.error(json.error.message);
        me.getOdcMessages().insert(0, alert);

        me.refreshStats();
    },
    onErrorWarningCheckboxSelect: function(box) {
    	var store = this.getSyncErrorGrid().getStore();
    	var prox = store.getProxy();
    	prox.setExtraParam("includeWarnings",box.isSelected());
    	store.load();
    },
//    onErrorSearchTextBlur: function(textField) {
//    	console.log("blurred "+textField.getValue());
//    },
    onErrorSearch: function(button) {
        var store = this.getSyncErrorGrid().getStore();
        var prox = store.getProxy();
        var searchGroups = ["patientId", "patientDfn",
            "patientIcn", "domain",
            "StackCheckBox", "rpcItemContent",
            "rpcUri"];
        for(var i = 0; i < searchGroups.length; ++i) {
            if(!(Ext.getCmp(searchGroups[i]).checked)) {
                searchGroups.splice(i--, 1);
            }
        }
        prox.setExtraParam("searchString",Ext.getCmp("SearchTextBox").getValue());
        prox.setExtraParam("searchAreas", searchGroups.join('-'));
        store.load();
    }
});