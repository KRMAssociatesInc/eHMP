'use strict';

require('../../../../env-setup');

//------------------------------------------------------------------------
// This is a unit test for terminology-utils.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------

var terminologyUtil = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');

describe('terminology-utils.js', function() {
    it('invalid JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('hi2u')).toBeFalsy();
    });
    it('null JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid(null)).toBeFalsy();
    });
    it('AllergyVUIDtoUMLSCui JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('AllergyVUIDtoUMLSCui')).toBeTruthy();
    });
    it('AllergyCHCSIenToUMLSCui JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('AllergyCHCSIenToUMLSCui')).toBeTruthy();
    });
    it('AllergyDODNcidToUMLSCui JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('AllergyDODNcidToUMLSCui')).toBeTruthy();
    });
    it('LabUseLOINCtoGetText JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('LabUseLOINCtoGetText')).toBeTruthy();
    });
    it('LabDODNcidToLOINC JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('LabDODNcidToLOINC')).toBeTruthy();
    });
    it('VitalsVuidToLoinc JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('VitalsVuidToLoinc')).toBeTruthy();
    });
    it('VitalsDODNcidToLoinc JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('VitalsDODNcidToLoinc')).toBeTruthy();
    });
    it('ProblemsIcd9ToSnomedCT JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('ProblemsIcd9ToSnomedCT')).toBeTruthy();
    });
    it('ProblemsMedcinIdToSnomedCT JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('ProblemsMedcinIdToSnomedCT')).toBeTruthy();
    });
    it('MedicationVuidToRxNorm JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('MedicationVuidToRxNorm')).toBeTruthy();
    });
    it('MedicationDodNcidToRxNorm JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('MedicationDodNcidToRxNorm')).toBeTruthy();
    });
    it('NotesVuidToLoinc JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('NotesVuidToLoinc')).toBeTruthy();
    });
    it('NotesDodNcidToLoinc JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('NotesDodNcidToLoinc')).toBeTruthy();
    });
    it('ImmunizationCptToCvx JLV mapping code', function(){
        expect(terminologyUtil._isMappingTypeValid('ImmunizationCptToCvx')).toBeTruthy();
    });
    it('All valid mapping types tested', function() {
        expect(terminologyUtil._isMappingTypeValid.validTypes.length).toEqual(14);
    });
});
