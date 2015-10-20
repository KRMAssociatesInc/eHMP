'use strict';

require('../../../../env-setup');

//------------------------------------------------------------------------
// This is a unit test for terminology-utils.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------

var TerminologyUtil = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');
var terminologyUtil = new TerminologyUtil(null, null);

describe('terminology-utils.js', function() {
    it('invalid JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('hi2u')).toBeFalsy();
    });
    it('null JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid(null)).toBeFalsy();
    });
    it('AllergyVUIDtoUMLSCui JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('AllergyVUIDtoUMLSCui')).toBeTruthy();
    });
    it('AllergyCHCSIenToUMLSCui JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('AllergyCHCSIenToUMLSCui')).toBeTruthy();
    });
    it('AllergyDODNcidToUMLSCui JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('AllergyDODNcidToUMLSCui')).toBeTruthy();
    });
    it('LabUseLOINCtoGetText JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('LabUseLOINCtoGetText')).toBeTruthy();
    });
    it('LabDODNcidToLOINC JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('LabDODNcidToLOINC')).toBeTruthy();
    });
    it('VitalsVuidToLoinc JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('VitalsVuidToLoinc')).toBeTruthy();
    });
    it('VitalsDODNcidToLoinc JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('VitalsDODNcidToLoinc')).toBeTruthy();
    });
    it('ProblemsIcd9ToSnomedCT JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('ProblemsIcd9ToSnomedCT')).toBeTruthy();
    });
    it('ProblemsMedcinIdToSnomedCT JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('ProblemsMedcinIdToSnomedCT')).toBeTruthy();
    });
    it('MedicationVuidToRxNorm JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('MedicationVuidToRxNorm')).toBeTruthy();
    });
    it('MedicationDodNcidToRxNorm JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('MedicationDodNcidToRxNorm')).toBeTruthy();
    });
    it('NotesVuidToLoinc JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('NotesVuidToLoinc')).toBeTruthy();
    });
    it('NotesDodNcidToLoinc JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('NotesDodNcidToLoinc')).toBeTruthy();
    });
    it('ImmunizationCptToCvx JLV mapping code', function(){
        expect(terminologyUtil.isMappingTypeValid('ImmunizationCptToCvx')).toBeTruthy();
    });
    it('All valid mapping types tested', function() {
        expect(TerminologyUtil.validTypes.length).toEqual(14);
    });
});
