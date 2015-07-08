/**
 * Singleton for tracking encounter context for the patient
 */

Ext.define('gov.va.hmp.EncounterContext', {

    singleton: true,

    config: {
        /**
         * @cfg patientInfo The current patient
         * @property {String} encounterInfo.roomBed
         * @property {String} encounterInfo.appointment
         * @property {String} encounterInfo.location
         */
        encounterInfo: {}
    },
    pid: null, // the current patient ID (null=no patient currently selected)

    uid: null,

    constructor: function (cfg) {
        this.initConfig(cfg);
    },

    setEncounterUid: function (pid, encounter) {
        if (encounter == null) {
            this.uid = '';
        }
        else if ( Ext.isString(encounter) ) { // restore from the server .. encounter is uid ...
            this.uid =  encounter;
        }
        else {
            this.uid =  (this.trimString(encounter.appointmentUid) != '') ? encounter.appointmentUid : encounter.admissionUid;
        }
        this.encounterInfo = { uid: this.uid };
    },

    // save the encounter info on the client side and then post it to the server
    setAndPostEncounterContext: function (pid, encounter, optionalCallback) {
        var me = this;
        if( pid == null || pid == '' ) { return; }

        if ( me.pid == pid && encounter != null  && me.checkEqual(encounter) ) {
            me.updateEncounterContext(me.pid);
            return;
        }

        me.encounterInfo = {};
        me.pid = pid;
        if ( encounter ) {
            var newUid = (me.trimString(encounter.appointmentUid) != '') ? encounter.appointmentUid : encounter.admissionUid;
            me.encounterInfo = Ext.apply(me.encounterInfo, { uid: newUid,
                                                             roomBed: encounter.roomBed,
                                                             appointment: encounter.appointment,
                                                             location: encounter.locationShortName,
                                                             initialized: false });
            me.uid = newUid;
            me.postEncounterUid(pid);
        }
    },

    postEncounterUid: function(pid) {
        var me = this;
        if (me.pid != pid) {return;}

        Ext.Ajax.request({
            url: '/context/encounter',
            params: {
                uid: me.uid
            },
            method: 'POST',
            failure: function (resp) {
                var err = Ext.decode(resp.responseText, true);
                if(err && err.error && err.error.code=="404") {
                    console.log(err.error.message);
                } else {
                }
            },
            success: function (resp) {
                me.updateEncounterContext(me.pid);
            }
        });
    },

    updateEncounterContext: function (pid) {
        // get all patient aware components and change their context
        var comps = Ext.ComponentQuery.query('[encounterAware=true]');
        for (var i = 0; i < comps.length; i++) {
            if ((!comps[i].ignorePatientChangeEvents) && comps[i].fireEvent('encounterchange', pid) !== true) {
                this.reportError('Unable to register new encounter context', comps[i]);
                return false;
            }
        }
    },

    checkEqual: function(encounter) {
        var me = this, newUid;
        if ( me.trimString(encounter.appointmentUid) != '') {
            newUid = encounter.appointmentUid;
            return newUid == me.encounterInfo.uid && me.equalStrings(me.encounterInfo.appointment, encounter.appointment);
        }
        else if ( me.trimString(encounter.admissionUid) != '' ){
            newUid  = encounter.admissionUid;
            return newUid == me.encounterInfo.uid && (me.equalStrings(me.encounterInfo.roomBed, encounter.roomBed) || me.equalStrings(me.encounterInfo.locationShortName, encounter.locationShortName));
        }
        else {
            return me.trimString(me.encounterInfo.uid) == '';
        }
    },

    trimString: function(str) {
        var s = str;
        if ( str == 'undefined' || str == null || str == '' ) {
            s = '';
        }
        return s;
    },

    equalStrings: function(str1, str2) {
        return this.trimString(str1) == this.trimString(str2);
    },

    reportError: function (msg, errorCmp) {
        Ext.getBody().mask('<h4>Fatal Error Changing Encounter Context</h4>' +
            '<p>The encounter context was changing when an unexpected error occurred. The user interface has been disabled for safety.</p>' +
            '<p>Please report this issue with the details below.</p>' +
            '<table class="hmp-labeled-values">' +
            '<tr><td>message</td><td>'+msg+'</td></tr>' +
            '<tr><td>component</td><td>'+errorCmp.getId()+'</td></tr>' +
            '</table>', 'alert alert-danger');
        console.log(msg);
        console.log(errorCmp);
    }

});
