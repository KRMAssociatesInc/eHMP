/**
 * Singleton for tracking patient context and coordinating patient context changes.
 *
 * The <pre>setPatientContext()</pre> method can be called to initate the multi-step
 * process of switching patient context which goes something like this:
 *
 * <ol>
 * <li>Fire the <pre>beforepatientchange</pre> event on all PatientAware components</li>
 * <li>If all event listeners return true, then ask the server to validate/authorize the new patient context
 *    - checks if its a valid patient (in the VPR)
 *    - checks for any patient access flags/warnings/checks</li>
 * <li>If there are any patient flags/warnings/checks to display, prompt the user and cancel
 * the whole patient context change if they do not acknowledge them</li>
 * <li>Fire the <pre>patientchange</pre> event on all PatientAware components.</li>
 * <li>Query all the PatientAware.pid component values to ensure that they all agree that the new patient context is the same.</li>
 * </ol>
 *
 * TODO: try to remove references to specific components in here for cleaner Model/View separation of concerns
 *
 * @see gov.va.hmp.PatientAware
 */
Ext.define('gov.va.hmp.PatientContext', {
    requires: [
        'gov.va.hmp.CcowContext'
    ],
    uses: 'gov.va.cpe.TaskWindow',
    singleton: true,
    config: {
        /**
         * TODO: rename me to currentPatient
         * @cfg patientInfo The current patient
         * @property {String} patientInfo.birthDate
         * @property {String} patientInfo.displayName
         * @property {String} patientInfo.familyName
         * @property {String} patientInfo.fullName
         * @property {String} patientInfo.genderCode
         * @property {String} patientInfo.genderName
         * @property {String} patientInfo.givenNames
         * @property {String} patientInfo.last4
         * @property {String} patientInfo.last5
         * @property {String} patientInfo.localId
         * @property {String} patientInfo.pid
         * @property {String} patientInfo.ssn
         * @property {String} patientInfo.summary
         * @property {String} patientInfo.cwad
         * @property {Object} patientInfo.teamInfo
         * @proprety {String} patientInfo.patDemDetails.text
         */
        patientInfo: {}
    },
    pid: null, // the current patient ID (null=no patient currently selected)
    patientPoll: true, // if true, will poll the current patient periodically to look for updated data.
    patientPollIntervalSec: 30, // how often should the patient be polled?
    patientPollLast: 0, // internal
    constructor: function (cfg) {
        var me = this;

        this.initConfig(cfg);

        // task for patient update polling (if patient polling and authenticated)
        if (this.patientPoll && this.patientPollIntervalSec > 0) {
            this.pollTask = {
                interval: me.patientPollIntervalSec * 1000,
                run: function () {
                    // if no patient context set, return
                    if (!me.patientAware || !me.pid || me.pid === null ) {
                        return;
                    }
                    // AJAX call to get the last modified/updated for the current patient
                    Ext.Ajax.request({
                        url: '/roster/ping',
                        params: {
                            'pid': me.pid
                        },
                        success: function (response) {
                            // TODO: check for 404/redirect (or better yet, have the server not redirect on XHR requests)
                            var results = JSON.parse(response.responseText);

                            if (me.patientPollLast === 0) {
                                me.patientPollLast = results.items[0].lastUpdated;
                            } else if (me.patientPollLast !== results.items[0].lastUpdated) {
                                // if there is a difference, alert!
                                me.warn('Notice: New data available for  ' + results.items[0].domainsUpdated + '<a href="javascript:refresh(' + me.pid + ');"> Click to reload</a>');

                                var updates = results.items[0].domainsUpdated;
                                me.patientPollLast = results.items[0].lastUpdated;
                                //create array and fire event to change tab colors on new patient data
                                //TODO need to attached meta-data instead of searching by tab title
                                var domains = updates.split(', ');
                                gov.va.hmp.PatientAware.setPatientUpdate(domains);
                            }
                        }
                    });

                }
            }
            Ext.TaskManager.start(this.pollTask);
        }
    },
    /**
     * This initiates the process of coordinating/authorizing/updating the patient context change
     * of all the PatientAware components on the screen by running the pre-switch-checks
     * on both the client and server.
     *
     * @return false IIF one of the PatientAware components veto'ed the change
     */
    setPatientContext: function (pid, optionalCallback) {
    	if(pid==null || pid=='') {return;}
        var me = this;
        var oldPid = me.pid;
        // reset the patient update date (for the patient poller)
        me.patientPollLast = 0;

        // first let any component veto a context change (ie: maybe there is a dirty editor)
        var comps = Ext.ComponentQuery.query('[patientAware=true]');
        for (var i = 0; i < comps.length; i++) {
            // TODO: could they return a string (veto reason eg 'You must save your worksheet first')?
            if (comps[i].fireEvent('beforepatientchange', pid, true, false, false) !== true) {
                // TODO: should this be the error mask? Mabye ErrorManager.warn()?
                return false;
            }
        }
        //if oldPid not define assume logging on CCOW should override the
        me.ccowPatient = false;
    	me.pid = pid;
        if ((typeof oldPid == 'undefined') || (oldPid == null) || (oldPid.length<1)) {
			var tempPid = gov.va.hmp.CcowContext.getCCOWPatient();
	        if (tempPid.length > 0) me.pid= tempPid;
	        me.ccowPatient = true;
	        me.setPatientContextAfterWeGotThePid(optionalCallback);
        } else if (gov.va.hmp.CcowContext.checkCcowChange(pid) == false) {
        	return false;
        } else {
        	me.setPatientContextAfterWeGotThePid(optionalCallback);
        }
    },

    getCcowPatient:function() {
        return gov.va.hmp.CcowContext.getCCOWPatient();
//        if (tempPid.length> 0) return tempPid;
    },
    
    setPatientContextAfterWeGotThePid: function(optionalCallback) {

    	var me = this;
        var comps = Ext.ComponentQuery.query('[patientAware=true]');
        for (var i = 0; i < comps.length; i++) {
            comps[i].fireEvent('patientchanging');
        }
    	 me.patientInfo = {};
         Ext.Ajax.request({
             url: '/context/patient?pid=' + me.pid,
             method: 'POST',
             optionalCallback: optionalCallback,
             failure: function (resp) {
             	var err = Ext.decode(resp.responseText, true);
             	if(err && err.error && err.error.code=="404") {
 					console.log(err.error.message);
 					me.clearPatientContext();
 				} else {
 					 me.reportError('Error selecting/changing patient context.  Please reload');
 		             me.clearPatientContext();
 				}
             },
             success: function (resp) {
                 var json = Ext.JSON.decode(resp.responseText);
                 var data = json.data;
                 me.patientInfo = Ext.apply(me.patientInfo, data.patient);
                 me.patientInfo = Ext.applyIf(me.patientInfo, data.additionalDemographics);
                 me.patientInfo = Ext.applyIf(me.patientInfo, data.syncStatus);
                 me.patientInfo = Ext.applyIf(me.patientInfo, data.isInPatient);
                 me.patientInfo = Ext.applyIf(me.patientInfo, data.currentLocation);

                 // if no patient security checks/flags/acknowledgements are required, then
                 // actually do the patient context update and return
                 if(data && data.patientChecks && Ext.Object.getSize(data.patientChecks)>0) {
                    me.patientCheckData = data.patientChecks;
                 } else {
                     me.patientCheckData = null;
                 }
                 if(data && data.syncStatus && Ext.Object.getSize(data.syncStatus)>0) {
                     me.syncStatus = data.syncStatus;
                 } else {
                     me.syncStatus = null;
                 }
                 if(data && data.isInPatient) {
                     me.isInPatient = data.isInPatient;
                 } else {
                     me.isInPatient = false;
                 }
//                 if (!data || !data.patientChecks || Ext.Object.getSize(data.patientChecks) == 0) {
//                     me.patientCheckData = null;
//                     me.updatePatientContext(me.pid);
//                     return;
//                 }

//                 me.patientCheckData = data.patientChecks;
                 me.updatePatientContext(me.pid);
                 if(Ext.isFunction(this.optionalCallback)) {
                	 this.optionalCallback();
                 }
             }
         });
    },

    /**
     * @private
     * Once the client and server have validated/confirmed the new requested patient context,
     * this does the actual work of changing the context and then verifying the change.
     */
    updatePatientContext: function (pid) {
        // get all patient aware components and change their context
        var comps = Ext.ComponentQuery.query('[patientAware=true]');
        for (var i = 0; i < comps.length; i++) {
            if ((!comps[i].ignorePatientChangeEvents) && comps[i].fireEvent('patientchange', pid) !== true) {
                this.reportError('Unable to register new patient context', comps[i]);
                return false;
            }
        } 
        
        // Some may have been cleared or removed from the above events being fired; Search detail panels, for instance.
        comps = Ext.ComponentQuery.query('[patientAware=true]');
        for (var i = 0; i < comps.length; i++) {
            if ((!comps[i].ignorePatientChangeEvents) && comps[i].pid !== pid) {
                this.reportError('Patient context validation error, expected pid "' + pid + '", but component reported "' + comps[i].pid + '"', comps[i]);
                return false;
            }
        }
        if (this.ccowPatient == true) gov.va.hmp.CcowContext.setIcon(1);
    },
    /**
     * @public
     * check to see if current patient has checks that need confirmation
     */
    hasPatientChecks: function () {
        return Ext.isDefined(this.patientCheckData) && this.patientCheckData != null;
    },

    hasSyncStatus: function () {
        return Ext.isDefined(this.syncStatus) && this.syncStatus != null;
    },

    /**
     * @public
     * use to refresh patient form when new data comes in
     */
    refreshPatientContext: function (pid) {
        var clazz = this;
        // first let any component veto a context change (ie: maybe there is a dirty editor)
        var comps = Ext.ComponentQuery.query('[patientAware=true]');
        for (var i = 0; i < comps.length; i++) {
            // TODO: could they return a string (veto reason eg 'You must save your worksheet first')?
            if (comps[i].fireEvent('beforepatientchange', pid, true, false, false) !== true) {
                // TODO: should this be the error mask? Mabye ErrorManager.warn()?
                return false;
            }
        }
        clazz.updatePatientContext(pid);
    },

    /**
     * @public
     * Call this when we need to clear all patient aware components of patient data - for
     * example, when the selected patient doesn't exist, or the patient selection has been
     * removed for some other reason.
     */
    clearPatientContext: function () {
        this.updatePatientContext(0);
    },

    /**
     * @private
     * If there was an error in the context change process, then this will display/report/resolve it.
     */
    reportError: function (msg, errorCmp) {
        Ext.getBody().mask('<h4>Fatal Error Changing Patient Context</h4>' +
            '<p>The patient context was changing when an unexpected error occurred. The user interface has been disabled for safety.</p>' +
            '<p>Please report this issue with the details below.</p>' +
            '<table class="hmp-labeled-values">' +
            '<tr><td>message</td><td>'+msg+'</td></tr>' +
            '<tr><td>component</td><td>'+errorCmp.getId()+'</td></tr>' +
            '</table>', 'alert alert-danger');
        console.log(msg);
        console.log(errorCmp);
    },

    setPatientUpdate: function (domains) {
        var comps = Ext.ComponentQuery.query('[patientAware=true]');
        for (var i = 0; i < comps.length; i++) {
            if (comps[i].fireEvent('patientupdate', domains) !== true) {
                this.reportError('Unable to register updated patient!', comps[i]);
                return false;
            }
        }
    }
});
