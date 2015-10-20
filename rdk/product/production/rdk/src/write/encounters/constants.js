'use strict';

// Service Category
module.exports.AMBULATORY                   = 'A';
module.exports.CHART_REVIEW                 = 'C';
module.exports.DAILY_HOSPITALIZATION_DATA   = 'D';
module.exports.EVENT_HISTORICAL             = 'E';
module.exports.HOSPITALIZATION              = 'H';
module.exports.IN_HOSPITAL                  = 'I';
module.exports.NOT_FOUND                    = 'N';
module.exports.OBSERVATION                  = 'O';
module.exports.NURSING_HOME                 = 'R';
module.exports.DAY_SURGERY                  = 'S';
module.exports.TELECOMMUNICATIONS           = 'T';
module.exports.ANCILLARY_PACKAGE_DAILY_DATA = 'X';

module.exports.SERVICE_CATEGORIES = ['A','C','D','E','H','I','N','O','R','S','T','X'];

// Encounter Types
module.exports.TYPE_CPT = 'CPT';
module.exports.TYPE_HF  = 'Health Factor';
module.exports.TYPE_IMM = 'Immunization';
module.exports.TYPE_PED = 'Patient Education';
module.exports.TYPE_POV = 'Purpose of Visit'; //Diagnosis
module.exports.TYPE_SK  = 'Skin';
module.exports.TYPE_XAM = 'Exam';

module.exports.ENCOUNTER_TYPES = ['TYPE_CPT', 'TYPE_HF', 'TYPE_IMM', 'TYPE_PED', 'TYPE_POV', 'TYPE_SK', 'TYPE_XAM'];

// Encounter IDs
module.exports.ID_CPT = '^ICPT';
module.exports.ID_HF  = '^AUTTHF';
module.exports.ID_IMM = '^AUTTIMM';
module.exports.ID_PED = '^AUTTEDT';
module.exports.ID_POV = '^ICD9';
module.exports.ID_SK  = '^AUTTSK';
module.exports.ID_XAM = '^AUTTEXAM';

module.exports.ENCOUNTER_IDS = ['ID_CPT', 'ID_HF', 'ID_IMM', 'ID_PED', 'ID_POV', 'ID_SK', 'ID_XAM' ];
