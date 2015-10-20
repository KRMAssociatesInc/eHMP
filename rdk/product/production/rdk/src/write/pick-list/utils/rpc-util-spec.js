'use strict';

var log = sinon.stub(require('bunyan').createLogger({
    name: 'problem-fetch-list'
}));

var removeExistingEntriesFromRPCResult = require('./rpc-util').removeExistingEntriesFromRPCResult;

var arrExistingEntries = [{'ien':'476','synonym':'A FIB-FLUTTER\\t<ATRIAL FIBRILLATION-FLUTTER>','name':'ATRIAL FIBRILLATION-FLUTTER'},{'ien':'237','synonym':'ABDOMINAL BLOATING','name':'ABDOMINAL BLOATING'},{'ien':'236','synonym':'ABDOMINAL CRAMPS','name':'ABDOMINAL CRAMPS'},{'ien':'429','synonym':'ABDOMINAL DISCOMFORT','name':'ABDOMINAL DISCOMFORT'},{'ien':'235','synonym':'ABDOMINAL PAIN','name':'ABDOMINAL PAIN'},{'ien':'430','synonym':'ABNORMAL ECG','name':'ABNORMAL ECG'},{'ien':'477','synonym':'ABNORMAL ECG\\t<ECG ABNORMALITY>','name':'ECG ABNORMALITY'},{'ien':'477','synonym':'ABNORMAL EKG\\t<ECG ABNORMALITY>','name':'ECG ABNORMALITY'},{'ien':'316','synonym':'ABNORMAL SEXUAL FUNCTION','name':'ABNORMAL SEXUAL FUNCTION'},{'ien':'526','synonym':'ABNORMAL VISION','name':'ABNORMAL VISION'},{'ien':'309','synonym':'ABSCESS','name':'ABSCESS'},{'ien':'308','synonym':'ACIDOSIS','name':'ACIDOSIS'},{'ien':'307','synonym':'ACNE','name':'ACNE'},{'ien':'306','synonym':'ACUTE INTERSTITIAL NEPHRITIS','name':'ACUTE INTERSTITIAL NEPHRITIS'},{'ien':'305','synonym':'ACUTE RENAL FAILURE SYNDROME','name':'ACUTE RENAL FAILURE SYNDROME'},{'ien':'304','synonym':'ACUTE RENAL IMPAIRMENT','name':'ACUTE RENAL IMPAIRMENT'},{'ien':'304','synonym':'ACUTE RENAL INSUFFICIENCY\\t<ACUTE RENAL IMPAIRMENT>','name':'ACUTE RENAL IMPAIRMENT'},{'ien':'234','synonym':'ACUTE RESPIRATORY DISTRESS','name':'ACUTE RESPIRATORY DISTRESS'},{'ien':'303','synonym':'ACUTE TUBULAR NECROSIS','name':'ACUTE TUBULAR NECROSIS'},{'ien':'314','synonym':'ACUTE UPPER AIRWAY OBSTRUCTION\\t<UPPER AIRWAY OBSTRUCTION>','name':'UPPER AIRWAY OBSTRUCTION'},{'ien':'476','synonym':'AFIB-FLUTTER\\t<ATRIAL FIBRILLATION-FLUTTER>','name':'ATRIAL FIBRILLATION-FLUTTER'},{'ien':'233','synonym':'AGGRESSION\\t<AGGRESSIVE BEHAVIOR>','name':'AGGRESSIVE BEHAVIOR'},{'ien':'233','synonym':'AGGRESSIVE BEHAVIOR','name':'AGGRESSIVE BEHAVIOR'},{'ien':'36','synonym':'AGITATION','name':'AGITATION'},{'ien':'423','synonym':'AGITATION\\t<FEELING AGITATED>','name':'FEELING AGITATED'},{'ien':'37','synonym':'AGRANULOCYTOSIS','name':'AGRANULOCYTOSIS'},{'ien':'306','synonym':'AIN\\t<ACUTE INTERSTITIAL NEPHRITIS>','name':'ACUTE INTERSTITIAL NEPHRITIS'},{'ien':'498','synonym':'AION\\t<ISCHEMIC OPTIC NEUROPATHY>','name':'ISCHEMIC OPTIC NEUROPATHY'},{'ien':'527','synonym':'AIRWAY CONSTRICTION','name':'AIRWAY CONSTRICTION'},{'ien':'314','synonym':'AIRWAY OBSTRUCTION\\t<UPPER AIRWAY OBSTRUCTION>','name':'UPPER AIRWAY OBSTRUCTION'},{'ien':'232','synonym':'AKATHISIA','name':'AKATHISIA'},{'ien':'302','synonym':'AKINESIA','name':'AKINESIA'},{'ien':'479','synonym':'ALK PHOS ELEVATED\\t<INCREASED ALKALINE PHOSPHATASE>','name':'INCREASED ALKALINE PHOSPHATASE'},{'ien':'479','synonym':'ALK PHOS INCREASED\\t<INCREASED ALKALINE PHOSPHATASE>','name':'INCREASED ALKALINE PHOSPHATASE'},{'ien':'479','synonym':'ALK, ELEVATED\\t<INCREASED ALKALINE PHOSPHATASE>','name':'INCREASED ALKALINE PHOSPHATASE'},{'ien':'231','synonym':'ALKALINE PHOSPHATASE RAISED','name':'ALKALINE PHOSPHATASE RAISED'},{'ien':'479','synonym':'ALKALINE PHOSPHATASE RAISED\\t<INCREASED ALKALINE PHOSPHATASE>','name':'INCREASED ALKALINE PHOSPHATASE'},{'ien':'545','synonym':'ALLERGIC PNEUMONITIS','name':'ALLERGIC PNEUMONITIS'},{'ien':'465','synonym':'ALLERGIC RHINITIS','name':'ALLERGIC RHINITIS'},{'ien':'7','synonym':'ALOPECIA','name':'ALOPECIA'},{'ien':'480','synonym':'ALT (SGPT) ELEVATED\\t<INCREASED SERUM ALT (SGPT)>','name':'INCREASED SERUM ALT (SGPT)'},{'ien':'229','synonym':'ALT (SGPT) LEVEL ABNORMAL','name':'ALT (SGPT) LEVEL ABNORMAL'},{'ien':'480','synonym':'ALT ELEVATED\\t<INCREASED SERUM ALT (SGPT)>','name':'INCREASED SERUM ALT (SGPT)'},{'ien':'480','synonym':'ALT INCREASED\\t<INCREASED SERUM ALT (SGPT)>','name':'INCREASED SERUM ALT (SGPT)'}];
var firstExistingEntry = [{'ien':'476','synonym':'A FIB-FLUTTER\\t<ATRIAL FIBRILLATION-FLUTTER>','name':'ATRIAL FIBRILLATION-FLUTTER'}];
var first2ExistingEntries = [{'ien':'476','synonym':'A FIB-FLUTTER\\t<ATRIAL FIBRILLATION-FLUTTER>','name':'ATRIAL FIBRILLATION-FLUTTER'},{'ien':'237','synonym':'ABDOMINAL BLOATING','name':'ABDOMINAL BLOATING'}];
var nonExistingEntry = [{'ien':'0','synonym':'BOGUS 1\\t<BOGUS 1>','name':'BOGUS 1'}];
var non2ExistingEntries = [{'ien':'0','synonym':'BOGUS 1\\t<BOGUS 1>','name':'BOGUS 1'},{'ien':'0','synonym':'BOGUS 2','name':'BOGUS 2'}];

describe('unit test to validate rpc-util filters correctly', function() {
    it('filters correctly with empty arrays', function () {
        var result = removeExistingEntriesFromRPCResult(log, arrExistingEntries, []);
        expect(result.length).to.equal(0);

        result = removeExistingEntriesFromRPCResult(log, [], firstExistingEntry);
        expect(result.length).to.equal(1);

        result = removeExistingEntriesFromRPCResult(log, [], first2ExistingEntries);
        expect(result.length).to.equal(2);
    });

    it('filters correctly', function () {
        var result = removeExistingEntriesFromRPCResult(log, arrExistingEntries, firstExistingEntry);
        expect(result.length).to.equal(0);

        result = removeExistingEntriesFromRPCResult(log, arrExistingEntries, first2ExistingEntries);
        expect(result.length).to.equal(0);

        result = removeExistingEntriesFromRPCResult(log, arrExistingEntries, nonExistingEntry);
        expect(result.length).to.equal(1);

        result = removeExistingEntriesFromRPCResult(log, arrExistingEntries, non2ExistingEntries);
        expect(result.length).to.equal(2);
    });
});
