'use strict';

require('../../../../env-setup');

var xformer = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-medication-xformer');

describe('jmeadows-medication-xformer', function() {

var mockEdipi = '00000099';

var sampleDodMedication = {
  'cdrEventId' : '1000001023',
  'codes' : [ {
    'code' : '3000268019',
    'display' : null,
    'system' : 'DOD_NCID'
  }, {
    'code' : '197378',
    'display' : 'Astemizole 10 MG Oral Tablet',
    'system' : 'RXNORM'
  } ],
  'patientId' : null,
  'patientName' : null,
  'site' : {
    'agency' : 'DOD',
    'dmisId' : null,
    'endpoints' : [ ],
    'id' : null,
    'moniker' : '4th Medical Group/0090',
    'name' : 'AHLTA',
    'permissions' : [ ],
    'region' : null,
    'siteCode' : '2.16.840.1.113883.3.42.126.100001.13',
    'status' : null
  },
  'sourceProtocol' : 'DODADAPTER',
  'active' : 'Expired',
  'comment' : '\nNONE',
  'daysSupply' : '30',
  'drugName' : 'ASTEMIZOLE, 10 MG, TABLET, ORAL',
  'fillOrderDate' : 1368331260000,
  'lastDispensingPharmacy' : 'PROVIDER ORDER ENTER',
  'medId' : '2157553059',
  'medType' : 'supply',
  'orderIEN' : null,
  'orderingProvider' : {
      'name' : 'SJF, FIVE'
  },
  'pharmacyId' : null,
  'prescriptionFills' : [ {
    'cdrEventId' : '1000001023',
    'codes' : [ ],
    'patientId' : null,
    'patientName' : null,
    'site' : {
      'agency' : 'DOD',
      'dmisId' : null,
      'endpoints' : [ ],
      'id' : null,
      'moniker' : '4th Medical Group/0090',
      'name' : 'AHLTA',
      'permissions' : [ ],
      'region' : null,
      'siteCode' : '2.16.840.1.113883.3.42.126.100001.13',
      'status' : null
    },
    'sourceProtocol' : 'DODADAPTER',
    'dispenseDate' : 1368392820000,
    'dispensingPharmacy' : 'PROVIDER ORDER ENTER',
    'dispensingQuantity' : '30'
  } ],
  'quantity' : '30',
  'refills' : '0',
  'sigCode' : 'TAKE 1 TABLET DAILY #30 RF0',
  'stopDate' : 1370984760000,
  'rxnumber' : '130512-00010'
};



 var sampleVPRMedication = {

      codes:
        [ { code: '3000268019', system: 'DOD_NCID' },
           { code: '197378',
             display: 'Astemizole 10 MG Oral Tablet',
             system: 'urn:oid:2.16.840.1.113883.6.88' } ],
      medStatus: 'Expired',
      medType: 'supply',
      patientInstruction: '\nNONE',
      productFormName: 'ASTEMIZOLE, 10 MG, TABLET, ORAL',
      productFormCode: '2157553059',
      name: 'ASTEMIZOLE, 10 MG, TABLET, ORAL',
      facilityName: 'DOD',
      facilityCode: 'DOD',
      sig: 'TAKE 1 TABLET DAILY #30 RF0',
      uid: 'urn:va:med:DOD:00000099:1000001023',
      vaStatus: 'Expired',
      overallStart: '20130512000100',
      overallStop: '20130611170600',
      vaType: 'SUPPLY',
      fills:
       [ { dispenseDate: '20130512170700',
           quantityDispensed: '30',
           dispensingPharmacy: 'PROVIDER ORDER ENTER' } ],
      products: [ { suppliedName: 'ASTEMIZOLE, 10 MG, TABLET, ORAL' } ],
      orders:
       [ { daysSupply: '30',
           quantityOrdered: '30',
           fillsRemaining: '0',
           providerName: 'SJF, FIVE' } ]
        };





var result = xformer(sampleDodMedication, mockEdipi);

      it('verify transform sample medication to VPR', function(){
       //console.log(result);
          expect(result.medStatus).toEqual(sampleVPRMedication.medStatus);
          expect(result.medType).toEqual(sampleVPRMedication.medType);
          expect(result.productFormName).toEqual(sampleVPRMedication.productFormName);
          expect(result.productFormCode).toEqual(sampleVPRMedication.productFormCode);
          expect(result.name).toEqual(sampleVPRMedication.name);
          expect(result.sig).toEqual(sampleVPRMedication.sig);
          expect(result.facilityName).toEqual(sampleVPRMedication.facilityName);
          expect(result.facilityCode).toEqual(sampleVPRMedication.facilityCode);
          expect(result.patientInstruction).toEqual(sampleVPRMedication.patientInstruction);
          expect(result.uid).toEqual(sampleVPRMedication.uid);
          expect(result.codes).toEqual(sampleVPRMedication.codes);
          expect(result.vaStatus).toEqual(sampleVPRMedication.vaStatus);
          expect(result.vaType).toEqual(sampleVPRMedication.vaType);
          expect(result.fills.quantityDispensed).toEqual(sampleVPRMedication.fills.quantityDispensed);
          expect(result.fills.dispensingPharmacy).toEqual(sampleVPRMedication.fills.dispensingPharmacy);
          expect(result.products).toEqual(sampleVPRMedication.products);
          expect(result.orders).toEqual(sampleVPRMedication.orders);
          expect(result.overallStart).not.toBeNull();
          expect(result.overallStop).not.toBeNull();
          expect(result.fills.dispenseDate).not.toBeNull();
      });

  });