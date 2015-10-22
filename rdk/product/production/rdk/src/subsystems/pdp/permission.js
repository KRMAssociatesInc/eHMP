'use strict';

var _ = require('underscore');
var permissions = require('./permissions');
var roles = require('./roles');

//add new permissions to an existent set of permissions, with no duplicates
var addPermissionsWithNoDuplicates = function(existentPermissions, newPermissions) {
    var result = [];
    if (_.isArray(existentPermissions) && existentPermissions.length !== 0) {
        result = existentPermissions;
    }

    result = _.union(result, newPermissions);
    result.sort();
    return result;
};

module.exports = {
    addPermissionsWithNoDuplicates: addPermissionsWithNoDuplicates,
    rules: [{
        'name': 'no-roles',
        'on': true,
        'condition': function(R) {
            R.when(this.roles.length === 0);
        },
        'consequence': function(R) {
            this.result = [];
            R.stop();
        }
    }, {
        'name': 'resident-doctor-dentist-role',
        'on': true,
        'condition': function(R) {
            //check if any role in the passed set of roles is part of a defined set of roles
            R.when(_.intersection(this.roles, [roles['resident'].val, roles['standardDoctor'].val, roles['dentist'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.addPatientAllergy,
                permissions.addPatientImmunization,
                permissions.addPatientLaborder,
                permissions.addPatientMedorder,
                permissions.addPatientPharmorder,
                permissions.addPatientConsultorder,
                permissions.addPatientProblem,
                permissions.addPatientRadiology,
                permissions.addPatientVital,
                permissions.addProgressNote,
                permissions.addClinicalNote,
                permissions.addPatientNote,
                permissions.addPatientVisit,
                permissions.editPatientAllergy,
                permissions.editPatientImmunization,
                permissions.editPatientLaborder,
                permissions.editPatientMedorder,
                permissions.editPatientPharmorder,
                permissions.editPatientConsultorder,
                permissions.editPatientProblem,
                permissions.editRadiologyOrder,
                permissions.editPatientVital,
                permissions.editProgressNote,
                permissions.editClinicalNote,
                permissions.editPatientNote,
                permissions.editSmokingStatus,
                permissions.editPatientVisit,
                permissions.eiePatientVital,
                permissions.removePatientAllergy,
                permissions.removePatientImmunization,
                permissions.removePatientLaborder,
                permissions.removePatientMedorder,
                permissions.removePatientPharmorder,
                permissions.removePatientConsultorder,
                permissions.removePatientProblem,
                permissions.removePatientRadiology,
                permissions.removePatientVital,
                permissions.removeProgressNote,
                permissions.removeClinicalNote,
                permissions.removePatientNote,
                permissions.removePatientVisit,
                permissions.releasePatientLaborder,
                permissions.releasePatientMedorder,
                permissions.releasePatientPharmorder,
                permissions.releasePatientConsultorder,
                permissions.releasePatientRadiology,
                permissions.signPatientLaborder,
                permissions.signPatientMedorder,
                permissions.signPatientPharmorder,
                permissions.signPatientConsultorder,
                permissions.signPatientRadiology,
                permissions.cosignPatientLaborder,
                permissions.cosignPatientMedorder,
                permissions.cosignPatientPharmorder,
                permissions.cosignPatientConsultorder,
                permissions.cosignPatientRadiology,
                permissions.signProgressNote,
                permissions.signClinicalNote,
                permissions.signPatientNote,
                permissions.addCosignerProgressNotes,
                permissions.addAddendumProgressNotes,
                permissions.editAddendumProgressNotes,
                permissions.signAddendumProgressNotes
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'physician-assistant-role',
        'on': true,
        'condition': function(R) {
            R.when(_.intersection(this.roles, [roles['physicianAssistant'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.addPatientAllergy,
                permissions.addPatientImmunization,
                permissions.addPatientLaborder,
                permissions.addPatientMedorder,
                permissions.addPatientPharmorder,
                permissions.addPatientConsultorder,
                permissions.addPatientProblem,
                permissions.addPatientRadiology,
                permissions.addPatientVital,
                permissions.addProgressNote,
                permissions.addClinicalNote,
                permissions.addPatientNote,
                permissions.addPatientVisit,
                permissions.editPatientAllergy,
                permissions.editPatientImmunization,
                permissions.editPatientLaborder,
                permissions.editPatientMedorder,
                permissions.editPatientPharmorder,
                permissions.editPatientConsultorder,
                permissions.editPatientProblem,
                permissions.editPatientVital,
                permissions.editProgressNote,
                permissions.editClinicalNote,
                permissions.editPatientNote,
                permissions.editSmokingStatus,
                permissions.editPatientVisit,
                permissions.eiePatientVital,
                permissions.removePatientImmunization,
                permissions.removePatientProblem,
                permissions.removePatientVital,
                permissions.removeProgressNote,
                permissions.removeClinicalNote,
                permissions.removePatientNote,
                permissions.removePatientVisit,
                permissions.releasePatientLaborder,
                permissions.releasePatientMedorder,
                permissions.releasePatientPharmorder,
                permissions.releasePatientConsultorder,
                permissions.releasePatientRadiology,
                permissions.signPatientLaborder,
                permissions.signPatientMedorder,
                permissions.signPatientPharmorder,
                permissions.signPatientConsultorder,
                permissions.signPatientRadiology,
                permissions.cosignPatientLaborder,
                permissions.cosignPatientMedorder,
                permissions.cosignPatientPharmorder,
                permissions.cosignPatientConsultorder,
                permissions.cosignPatientRadiology,
                permissions.signProgressNote,
                permissions.signClinicalNote,
                permissions.signPatientNote,
                permissions.addCosignerProgressNotes,
                permissions.addAddendumProgressNotes,
                permissions.editAddendumProgressNotes,
                permissions.signAddendumProgressNotes
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'nurse-practitioner-role',
        'on': true,
        'condition': function(R) {
            R.when(_.intersection(this.roles, [roles['nursePractitioner'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.addPatientAllergy,
                permissions.addPatientImmunization,
                permissions.addPatientLaborder,
                permissions.addPatientMedorder,
                permissions.addPatientPharmorder,
                permissions.addPatientConsultorder,
                permissions.addPatientProblem,
                permissions.addPatientRadiology,
                permissions.addPatientVital,
                permissions.addProgressNote,
                permissions.addClinicalNote,
                permissions.addPatientNote,
                permissions.addPatientVisit,
                permissions.editPatientAllergy,
                permissions.editPatientImmunization,
                permissions.editPatientLaborder,
                permissions.editPatientMedorder,
                permissions.editPatientPharmorder,
                permissions.editPatientConsultorder,
                permissions.editPatientProblem,
                permissions.editPatientVital,
                permissions.editProgressNote,
                permissions.editClinicalNote,
                permissions.editPatientNote,
                permissions.editSmokingStatus,
                permissions.editPatientVisit,
                permissions.eiePatientVital,
                permissions.removePatientImmunization,
                permissions.removePatientVital,
                permissions.removeProgressNote,
                permissions.removeClinicalNote,
                permissions.removePatientNote,
                permissions.removePatientVisit,
                permissions.releasePatientLaborder,
                permissions.releasePatientMedorder,
                permissions.releasePatientPharmorder,
                permissions.releasePatientConsultorder,
                permissions.releasePatientRadiology,
                permissions.cosignPatientLaborder,
                permissions.cosignPatientMedorder,
                permissions.cosignPatientPharmorder,
                permissions.cosignPatientConsultorder,
                permissions.cosignPatientRadiology,
                permissions.signProgressNote,
                permissions.signClinicalNote,
                permissions.signPatientNote,
                permissions.addCosignerProgressNotes,
                permissions.addAddendumProgressNotes,
                permissions.editAddendumProgressNotes,
                permissions.signAddendumProgressNotes
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'intern-student-role',
        'on': true,
        'condition': function(R) {
            R.when(_.intersection(this.roles, [roles['internStudent'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.addPatientAllergy,
                permissions.addPatientImmunization,
                permissions.addPatientLaborder,
                permissions.addPatientMedorder,
                permissions.addPatientPharmorder,
                permissions.addPatientConsultorder,
                permissions.addPatientProblem,
                permissions.addPatientRadiology,
                permissions.addPatientVital,
                permissions.addProgressNote,
                permissions.addClinicalNote,
                permissions.addPatientNote,
                permissions.addPatientVisit,
                permissions.editPatientAllergy,
                permissions.editPatientImmunization,
                permissions.editPatientLaborder,
                permissions.editPatientMedorder,
                permissions.editPatientPharmorder,
                permissions.editPatientConsultorder,
                permissions.editPatientProblem,
                permissions.editPatientVital,
                permissions.editProgressNote,
                permissions.editClinicalNote,
                permissions.editPatientNote,
                permissions.editSmokingStatus,
                permissions.editPatientVisit,
                permissions.eiePatientVital,
                permissions.removePatientImmunization,
                permissions.removePatientProblem,
                permissions.removePatientVital,
                permissions.removeProgressNote,
                permissions.removeClinicalNote,
                permissions.removePatientNote,
                permissions.removePatientVisit,
                permissions.cosignPatientLaborder,
                permissions.cosignPatientMedorder,
                permissions.cosignPatientPharmorder,
                permissions.cosignPatientConsultorder,
                permissions.cosignPatientRadiology,
                permissions.signProgressNote,
                permissions.signClinicalNote,
                permissions.signPatientNote,
                permissions.addCosignerProgressNotes,
                permissions.addAddendumProgressNotes,
                permissions.editAddendumProgressNotes,
                permissions.signAddendumProgressNotes
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'rn-nurse-manager-role',
        'on': true,
        'condition': function(R) {
            R.when(_.intersection(this.roles, [roles['registeredNurse'].val, roles['nurseManager'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.addPatientAllergy,
                permissions.addPatientImmunization,
                permissions.addPatientLaborder,
                permissions.addPatientMedorder,
                permissions.addPatientPharmorder,
                permissions.addPatientConsultorder,
                permissions.addPatientProblem,
                permissions.addPatientRadiology,
                permissions.addPatientVital,
                permissions.addProgressNote,
                permissions.addClinicalNote,
                permissions.addPatientNote,
                permissions.addPatientVisit,
                permissions.editPatientAllergy,
                permissions.editPatientImmunization,
                permissions.editPatientLaborder,
                permissions.editPatientMedorder,
                permissions.editPatientPharmorder,
                permissions.editPatientConsultorder,
                permissions.editPatientProblem,
                permissions.editPatientVital,
                permissions.editProgressNote,
                permissions.editClinicalNote,
                permissions.editPatientNote,
                permissions.editSmokingStatus,
                permissions.editPatientVisit,
                permissions.eiePatientVital,
                permissions.removePatientImmunization,
                permissions.removePatientVital,
                permissions.removeProgressNote,
                permissions.removeClinicalNote,
                permissions.removePatientNote,
                permissions.removePatientVisit,
                permissions.releasePatientLaborder,
                permissions.releasePatientMedorder,
                permissions.releasePatientPharmorder,
                permissions.releasePatientConsultorder,
                permissions.releasePatientRadiology,
                permissions.signProgressNote,
                permissions.signClinicalNote,
                permissions.signPatientNote,
                permissions.addCosignerProgressNotes,
                permissions.addAddendumProgressNotes,
                permissions.editAddendumProgressNotes,
                permissions.signAddendumProgressNotes
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'lpn-role',
        'on': true,
        'condition': function(R) {
            R.when(_.intersection(this.roles, [roles['licencsedPracticingNurse'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.addPatientAllergy,
                permissions.addPatientImmunization,
                permissions.addPatientProblem,
                permissions.addPatientVital,
                permissions.addProgressNote,
                permissions.addClinicalNote,
                permissions.addPatientNote,
                permissions.addPatientVisit,
                permissions.editPatientAllergy,
                permissions.editPatientImmunization,
                permissions.editPatientLaborder,
                permissions.editPatientMedorder,
                permissions.editPatientPharmorder,
                permissions.editPatientConsultorder,
                permissions.editPatientProblem,
                permissions.editPatientVital,
                permissions.editProgressNote,
                permissions.editClinicalNote,
                permissions.editPatientNote,
                permissions.editSmokingStatus,
                permissions.editPatientVisit,
                permissions.eiePatientVital,
                permissions.removePatientImmunization,
                permissions.removePatientVital,
                permissions.removeProgressNote,
                permissions.removeClinicalNote,
                permissions.removePatientNote,
                permissions.removePatientVisit,
                permissions.signProgressNote,
                permissions.signClinicalNote,
                permissions.signPatientNote,
                permissions.addCosignerProgressNotes,
                permissions.addAddendumProgressNotes,
                permissions.editAddendumProgressNotes,
                permissions.signAddendumProgressNotes
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'Scheduler',
        'on': true,
        'condition': function(R) {
            R.when(_.intersection(this.roles, [roles['scheduler'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.addProgressNote,
                permissions.addClinicalNote,
                permissions.addPatientNote,
                permissions.addPatientVisit,
                permissions.editPatientAllergy,
                permissions.editPatientLaborder,
                permissions.editPatientMedorder,
                permissions.editPatientPharmorder,
                permissions.editPatientConsultorder,
                permissions.editProgressNote,
                permissions.editClinicalNote,
                permissions.editPatientNote,
                permissions.editSmokingStatus,
                permissions.editPatientVisit,
                permissions.eiePatientAllergy,
                permissions.removeProgressNote,
                permissions.removeClinicalNote,
                permissions.removePatientNote,
                permissions.removePatientVisit
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'ward-clerk',
        'on': true,
        'condition': function(R) {
            R.when(_.intersection(this.roles, [roles['wardClerk'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.addProgressNote,
                permissions.addClinicalNote,
                permissions.addPatientNote,
                permissions.addPatientVisit,
                permissions.editPatientAllergy,
                permissions.editPatientLaborder,
                permissions.editPatientMedorder,
                permissions.editPatientPharmorder,
                permissions.editPatientConsultorder,
                permissions.editProgressNote,
                permissions.editClinicalNote,
                permissions.editPatientNote,
                permissions.editSmokingStatus,
                permissions.editPatientVisit,
                permissions.eiePatientAllergy,
                permissions.removeProgressNote,
                permissions.removeClinicalNote,
                permissions.removePatientNote,
                permissions.removePatientVisit,
                permissions.releasePatientLaborder,
                permissions.releasePatientMedorder,
                permissions.releasePatientPharmorder,
                permissions.releasePatientConsultorder,
                permissions.releasePatientRadiology
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'medical-technician-pharmacist-lab-tech-role',
        'on': true,
        'condition': function(R) {
            R.when(_.intersection(this.roles, [roles['medicalTechnician'].val, roles['pharmacist'].val, roles['labTech'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.editPatientLaborder,
                permissions.editPatientMedorder,
                permissions.editPatientPharmorder,
                permissions.editPatientConsultorder
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'acc-role',
        'on': true,
        'condition': function(R) {
            R.when(_.intersection(this.roles, [roles['acc'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.addUserRoles,
                permissions.editUserRoles,
                permissions.readAccScreen,
                permissions.removeUserRoles
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'chief-mis-role',
        'on': true,
        'condition': function(R) {
            R.when(_.intersection(this.roles, [roles['chief'].val, roles['mis'].val]).length > 0);
        },
        'consequence': function(R) {
            var userPermissions = [
                permissions.readFullBodyRetractedNotes
            ];

            this.result = addPermissionsWithNoDuplicates(this.result, userPermissions);
            R.next();
        }
    }, {
        'name': 'default',
        'on': true,
        'condition': function(R) {
            R.when(true);
        },
        'consequence': function(R) {
            this.result = addPermissionsWithNoDuplicates(this.result, []);
            R.stop();
        }
    }]
};
