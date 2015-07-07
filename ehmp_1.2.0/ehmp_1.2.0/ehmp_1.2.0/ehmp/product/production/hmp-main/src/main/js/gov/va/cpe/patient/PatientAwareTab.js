/**
 * Created with IntelliJ IDEA.
 * User: vhaisllees
 * Date: 10/16/13
 * Time: 10:30 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('gov.va.cpe.patient.PatientAwareTab', {
    requires: [
        'gov.va.hmp.PatientContext'
    ],

    patientAwareTab: true,

    enablePatientAware: function() {
        this.setPatientAware(true);
    },

    disablePatientAware: function() {
       this.setPatientAware(false);
    },

    setPatientAware: function(flag) {
        for (var i=0; i<this.items.items.length; i++) {
            var item =  this.items.items[i];
            if ( typeof(item.patientAware) !== 'undefined' ) {
                item.patientAware = flag;
                if ( flag ) {
                    if ( item.pid != 0 && item.pid != gov.va.hmp.PatientContext.pid ) {
                        item.pid =  gov.va.hmp.PatientContext.pid;
                        item.reload();
                    }
                }
            }
        }
    }
});



