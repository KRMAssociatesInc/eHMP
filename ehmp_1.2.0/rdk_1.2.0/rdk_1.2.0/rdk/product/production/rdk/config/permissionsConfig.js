module.exports.edition = {
    ONC: [
        'edit-patient-record',
        'add-patient-allergy',
        'remove-patient-allergy',
        'add-patient-vital',
        'remove-patient-vital',
        'add-patient-med',
        'edit-patient-med',
        'remove-patient-med',
        'add-patient-problem',
        'edit-patient-problem',
        'remove-patient-problem',
        'add-patient-laborder',
        'edit-patient-laborder',
        'remove-patient-laborder',
        'add-patient-radiology',
        'edit-patient-radiology',
        'remove-patient-radiology',
        'patient-visit',
        'add-patient-order',
        'add-patient-immunization',
        'edit-patient-immunization',
        'edit-patient-demographics',
        'save-userdefined-screens'
    ],
    VIEWER: []
};

/**
 * if the accessCode exists here, user gets those permissions
 * else user gets permissions based on ONC/VIEWER edition
 */
module.exports.user = {
    //pu1234: ['pu-permission']
};
