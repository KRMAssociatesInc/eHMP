/**
 * This is a mixin that should be used by any ExtJS component wanting to dynamically coordinate and
 * change patient context without a browser refresh.
 *
 * This mixin primarily provides two events (beforepatientchange and patientchange) and current patient
 * field (pid).
 *
 * The <pre>beforepatientchange</pre> event gives each component an opportunity to veto the context change
 * (for example if there are dirty editors) or to use alert() and confirm().
 *
 * The <pre>patientchange</pre> event must be implemented by each component to explicitly
 * discard the prior patient context (if any) and acknowledge the new PID as current context
 * by setting the <pre>pid</pre> field and returning true.
 *
 * The <pre>setPatientContext()</pre> method can be called on any PatientAware component
 * (or statically via {@link gov.va.hmp.PatientContext#setPatientContext} to initate the multi-step
 * process of switching patient context.
 *
 * See {@link gov.va.hmp.PatientContext} for more details.
 */
Ext.define('gov.va.hmp.PatientAware', {
    requires:[
        'gov.va.hmp.PatientContext',
        'gov.va.hmp.CcowContext'
    ],
    pid:null, // the current patient ID according to this component (null=no patient currently selected)
    patientAware:true, // this is the way to identify/query for all patient aware mixin objects

    constructor:function (config) {
        this.addEvents(
            /**
             * @event beforepatientchange
             *
             * Gives each component an opportunity to veto the context change
             * (for example if there are dirty editors) or to use alert() and confirm().
             */
            'beforepatientchange',
            /**
             * @event patientchange
             *
             * Must be implemented by each component to explicitly
             * discard the prior patient context (if any) and acknowledge the new PID as current context
             * by setting the <pre>pid</pre> field and returning true.
             */
            'patientchange',
            /**
             * @event patientupdate
             */
            'patientupdate');
        return this.callParent(config);
    },

    /**
     * returns the current patient info
     */
    getPatientInfo:function () {
        return gov.va.hmp.PatientContext.getPatientInfo();
    },

    setPatientContext:function (pid) {
        // simply delegate from this instance method to the singleton
        gov.va.hmp.PatientContext.setPatientContext(pid);
    },

    setPatientUpdate:function (domains) {
        gov.va.hmp.PatientContext.setPatientUpdate(domains);
    },

    initPatientContext:function () {
        var pid = gov.va.hmp.PatientContext.pid;
        var tempPid = gov.va.hmp.CcowContext.getCCOWPatient();
        if((pid==null || pid=='') && tempPid!=null) {
        	// First time init - no PID selected;
        	var afterAjax = function() {
        		pid = gov.va.hmp.PatientContext.pid;
        		 if (pid !== null && pid !== '') {
    	            if (this.fireEvent('beforepatientchange', pid) !== true) {
    	                gov.va.hmp.PatientContext.reportError('Unable to initialize patient context!', this);
    	                return;
    	            }
    	            if (this.fireEvent('patientchange', pid) !== true) {
    	                gov.va.hmp.PatientContext.reportError('Unable to initialize patient context!', this);
    	            }
    	        }
        	};
        	// Set the pid on PatientContext and execute my stuff after it is done loading the patient info.
        	gov.va.hmp.PatientContext.setPatientContext(tempPid, afterAjax);
        } else {
        	if (tempPid !== null && tempPid.length) pid = tempPid;
            if (pid !== null && pid !== '') {
                if (this.fireEvent('beforepatientchange', pid) !== true) {
                    gov.va.hmp.PatientContext.reportError('Unable to initialize patient context!', this);
                    return;
                }
                if (this.fireEvent('patientchange', pid) !== true) {
                    gov.va.hmp.PatientContext.reportError('Unable to initialize patient context!', this);
                }
            }
        }
        
    }
});