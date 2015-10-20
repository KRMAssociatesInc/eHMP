'use strict';
module.exports = (function() {
    var domains = {
        'accession': 'accession',
        'patient': 'patient',
        'vital': 'vitalsign',
        'problem': 'problem',
        'allergy': 'allergy',
        'order': 'order',
        'treatment': 'treatment',
        'med': 'medication',
        'consult': 'consult',
        'procedure': 'procedure',
        'obs': 'observation',
        'lab': 'laboratory',
        'image': 'procedure',
        'surgery': 'procedure',
        'document': 'document',
        'mh': 'mentalhealth',
        'immunization': 'immunization',
        'pov': 'purposeofvisit',
        'skin': 'skintest',
        'exam': 'exam',
        'cpt': 'visitcptcode',
        'education': 'educationtopic',
        'factor': 'healthfactor',
        'appointment': 'encounter',
        'visit': 'encounter',
        'ptf': 'visittreatment',
        'rad': 'imaging'
    };
    return {
        jds: function(jdsname) {
            return domains[jdsname] || 'unknown';
        }
    };

})();
