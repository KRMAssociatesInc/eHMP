'use strict';
var jdsInput = {
    'apiVersion': '1.0',
    'data': {
        'updated': 20150621211546,
        'totalItems': 3,
        'currentItemCount': 3,
        'items': [
            {
                'IMO': false,
                'codes': [
                    {
                        'code': '312615',
                        'display': 'Prednisone 20 MG Oral Tablet',
                        'system': 'urn:oid:2.16.840.1.113883.6.88'
                    }
                ],
                'dosages': [
                    {
                        'amount': '3',
                        'complexConjunction': 'T',
                        'complexDuration': '1 DAYS',
                        'dose': '60',
                        'instructions': '60MG',
                        'noun': 'TABLETS',
                        'relativeStart': 0,
                        'relativeStop': 1440,
                        'routeName': 'PO',
                        'scheduleFreq': 1440,
                        'scheduleName': 'QDAY',
                        'scheduleType': 'CONTINUOUS',
                        'start': '20140528',
                        'stop': '20140529',
                        'summary': 'MedicationDose{uid=\'\'}',
                        'units': 'MG'
                    },
                    {
                        'amount': '2.5',
                        'complexConjunction': 'T',
                        'complexDuration': '1 DAYS',
                        'dose': '50',
                        'instructions': '50MG',
                        'noun': 'TABLETS',
                        'relativeStart': 1440,
                        'relativeStop': 2880,
                        'routeName': 'PO',
                        'scheduleFreq': 1440,
                        'scheduleName': 'QDAY',
                        'scheduleType': 'CONTINUOUS',
                        'start': '20140529',
                        'stop': '20140530',
                        'summary': 'MedicationDose{uid=\'\'}',
                        'units': 'MG'
                    },
                    {
                        'amount': '2',
                        'complexConjunction': 'T',
                        'complexDuration': '1 DAYS',
                        'dose': '40',
                        'instructions': '40MG',
                        'noun': 'TABLETS',
                        'relativeStart': 2880,
                        'relativeStop': 4320,
                        'routeName': 'PO',
                        'scheduleFreq': 1440,
                        'scheduleName': 'QDAY',
                        'scheduleType': 'CONTINUOUS',
                        'start': '20140530',
                        'stop': '20140531',
                        'summary': 'MedicationDose{uid=\'\'}',
                        'units': 'MG'
                    },
                    {
                        'amount': '1.5',
                        'complexConjunction': 'T',
                        'complexDuration': '1 DAYS',
                        'dose': '30',
                        'instructions': '30MG',
                        'noun': 'TABLETS',
                        'relativeStart': 4320,
                        'relativeStop': 5760,
                        'routeName': 'PO',
                        'scheduleFreq': 1440,
                        'scheduleName': 'QDAY',
                        'scheduleType': 'CONTINUOUS',
                        'start': '20140531',
                        'stop': '20140601',
                        'summary': 'MedicationDose{uid=\'\'}',
                        'units': 'MG'
                    },
                    {
                        'amount': '1',
                        'complexConjunction': 'T',
                        'complexDuration': '1 DAYS',
                        'dose': '20',
                        'instructions': '20MG',
                        'noun': 'TABLET',
                        'relativeStart': 5760,
                        'relativeStop': 7200,
                        'routeName': 'PO',
                        'scheduleFreq': 1440,
                        'scheduleName': 'QDAY',
                        'scheduleType': 'CONTINUOUS',
                        'start': '20140601',
                        'stop': '20140602',
                        'summary': 'MedicationDose{uid=\'\'}',
                        'units': 'MG'
                    },
                    {
                        'amount': '0.5',
                        'complexDuration': '2 DAYS',
                        'dose': '10',
                        'instructions': '10MG',
                        'noun': 'TABLET',
                        'relativeStart': 7200,
                        'relativeStop': 10080,
                        'routeName': 'PO',
                        'scheduleFreq': 1440,
                        'scheduleName': 'QDAY',
                        'scheduleType': 'CONTINUOUS',
                        'start': '20140602',
                        'stop': '20140604',
                        'summary': 'MedicationDose{uid=\'\'}',
                        'units': 'MG'
                    }
                ],
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'fills': [
                    {
                        'daysSupplyDispensed': 7,
                        'dispenseDate': '20140528',
                        'quantityDispensed': '11',
                        'releaseDate': '',
                        'routing': 'W',
                        'summary': 'MedicationFill{uid=\'\'}'
                    }
                ],
                'kind': 'Medication, Outpatient',
                'lastFilled': '20140528',
                'lastUpdateTime': '20140627000000',
                'localId': '404201;O',
                'medStatus': 'urn:sct:392521001',
                'medStatusName': 'historical',
                'medType': 'urn:sct:73639000',
                'name': 'PREDNISONE TAB',
                'orders': [
                    {
                        'daysSupply': 7,
                        'fillCost': '0.572',
                        'fillsAllowed': 0,
                        'fillsRemaining': 0,
                        'locationName': 'GENERAL MEDICINE',
                        'locationUid': 'urn:va:location:9E7A:23',
                        'orderUid': 'urn:va:order:9E7A:8:35739',
                        'ordered': '201405281627',
                        'pharmacistName': 'PROGRAMMER,ONE',
                        'pharmacistUid': 'urn:va:user:9E7A:1',
                        'prescriptionId': 500983,
                        'providerName': 'PROVIDER,SEVENTYTHREE',
                        'providerUid': 'urn:va:user:9E7A:1999',
                        'quantityOrdered': '11',
                        'summary': 'MedicationOrder{uid=\'\'}',
                        'vaRouting': 'W'
                    }
                ],
                'overallStart': '20140528',
                'overallStop': '20140627',
                'patientInstruction': '',
                'pid': '9E7A;8',
                'productFormName': 'TAB',
                'products': [
                    {
                        'drugClassCode': 'urn:vadc:HS051',
                        'drugClassName': 'GLUCOCORTICOIDS',
                        'ingredientCode': 'urn:va:vuid:4017876',
                        'ingredientCodeName': 'PREDNISONE',
                        'ingredientName': 'PREDNISONE TAB',
                        'ingredientRXNCode': 'urn:rxnorm:8640',
                        'ingredientRole': 'urn:sct:410942007',
                        'strength': '20 MG',
                        'summary': 'MedicationProduct{uid=\'\'}',
                        'suppliedCode': 'urn:va:vuid:4002616',
                        'suppliedName': 'PREDNISONE 20MG TAB'
                    }
                ],
                'qualifiedName': 'PREDNISONE TAB',
                'rxncodes': [
                    'urn:vandf:4017876',
                    'urn:ndfrt:N0000189939',
                    'urn:ndfrt:N0000000001',
                    'urn:ndfrt:N0000175576',
                    'urn:rxnorm:8640',
                    'urn:ndfrt:N0000006687'
                ],
                'sig': 'TAKE THREE TABLETS BY MOUTH EVERY DAY FOR 1 DAYS THEN TAKE TWO AND ONE-HALF TABLETS BY MOUTH EVERY DAY FOR 1 DAYS THEN TAKE TWO TABLETS BY MOUTH EVERY DAY FOR 1 DAYS THEN TAKE ONE AND ONE-HALF TABLETS BY MOUTH EVERY DAY FOR 1 DAYS THEN TAKE ONE TABLET BY MOUTH EVERY DAY FOR 1 DAYS THEN TAKE ONE-HALF TABLET BY MOUTH EVERY DAY FOR 2 DAYS',
                'stampTime': '20140627000000',
                'stopped': '20140627',
                'summary': 'PREDNISONE 20MG TAB (EXPIRED)\n TAKE THREE TABLETS BY MOUTH EVERY DAY FOR 1 DAYS THEN TAKE TWO AND ONE-HALF TABLETS BY MOUTH EVERY DAY FOR 1 DAYS THEN TAKE TWO TABLETS BY MOUTH EVERY DAY FOR 1 DAYS THEN TAKE ONE AND ONE-HALF TABLETS BY MOUTH EVERY DAY FOR 1 DAYS THEN TAKE ONE TABLET BY MOUTH EVERY DAY FOR 1 DAYS THEN TAKE ONE-HALF TABLET BY MOUTH EVERY DAY FOR 2 DAYS',
                'supply': false,
                'type': 'Prescription',
                'uid': 'urn:va:med:9E7A:8:35739',
                'units': 'MG',
                'vaStatus': 'EXPIRED',
                'vaType': 'O'
            },
            {
                'IMO': false,
                'codes': [
                    {
                        'code': '310429',
                        'display': 'Furosemide 20 MG Oral Tablet',
                        'system': 'urn:oid:2.16.840.1.113883.6.88'
                    }
                ],
                'dosages': [
                    {
                        'instructions': '20MG',
                        'relativeStart': 0,
                        'relativeStop': 17880,
                        'routeName': 'PO',
                        'scheduleName': 'MO-WE-FR@08-13-19',
                        'start': '200002101300',
                        'stop': '200002222300',
                        'summary': 'MedicationDose{uid=\'\'}'
                    }
                ],
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'kind': 'Medication, Inpatient',
                'lastUpdateTime': '20000222230000',
                'localId': '133U;I',
                'medStatus': 'urn:sct:392521001',
                'medStatusName': 'historical',
                'medType': 'urn:sct:105903003',
                'name': 'FUROSEMIDE TAB',
                'orders': [
                    {
                        'locationName': '5 WEST PSYCH',
                        'locationUid': 'urn:va:location:9E7A:66',
                        'orderUid': 'urn:va:order:9E7A:8:12004',
                        'ordered': '200002101046',
                        'pharmacistName': 'PROGRAMMER,TWENTYEIGHT',
                        'pharmacistUid': 'urn:va:user:9E7A:923',
                        'predecessor': 'urn:va:med:9E7A:8:10769',
                        'providerName': 'PROGRAMMER,TWENTYEIGHT',
                        'providerUid': 'urn:va:user:9E7A:923',
                        'summary': 'MedicationOrder{uid=\'\'}'
                    }
                ],
                'overallStart': '200002101300',
                'overallStop': '200002222300',
                'pid': '9E7A;8',
                'productFormName': 'TAB',
                'products': [
                    {
                        'drugClassCode': 'urn:vadc:CV702',
                        'drugClassName': 'LOOP DIURETICS',
                        'ingredientCode': 'urn:va:vuid:4017830',
                        'ingredientCodeName': 'FUROSEMIDE',
                        'ingredientName': 'FUROSEMIDE TAB',
                        'ingredientRXNCode': 'urn:rxnorm:4603',
                        'ingredientRole': 'urn:sct:410942007',
                        'strength': '20 MG',
                        'summary': 'MedicationProduct{uid=\'\'}',
                        'suppliedCode': 'urn:va:vuid:4002369',
                        'suppliedName': 'FUROSEMIDE 20MG TAB'
                    }
                ],
                'qualifiedName': 'FUROSEMIDE TAB',
                'rxncodes': [
                    'urn:vandf:4017830',
                    'urn:ndfrt:N0000008034',
                    'urn:ndfrt:N0000007516',
                    'urn:ndfrt:N0000000002',
                    'urn:ndfrt:N0000007676',
                    'urn:ndfrt:N0000008168',
                    'urn:rxnorm:4603',
                    'urn:ndfrt:N0000146188'
                ],
                'sig': 'Give: ',
                'stampTime': '20000222230000',
                'stopped': '200002222300',
                'summary': 'FUROSEMIDE TAB (EXPIRED)\n Give: ',
                'supply': false,
                'uid': 'urn:va:med:9E7A:8:12004',
                'vaStatus': 'EXPIRED',
                'vaType': 'I'
            },
            {
                'IMO': false,
                'codes': [
                    {
                        'code': '1232113',
                        'display': '1 ML Morphine Sulfate 15 MG/ML Prefilled Syringe',
                        'system': 'urn:oid:2.16.840.1.113883.6.88'
                    }
                ],
                'dosages': [
                    {
                        'adminTimes': '05-13-21',
                        'duration': 'INFUSE OVER 35 MIN.',
                        'routeName': 'IVPB',
                        'scheduleFreq': 480,
                        'scheduleName': 'Q8H',
                        'scheduleType': 'CONTINUOUS',
                        'summary': 'MedicationDose{uid=\'\'}'
                    }
                ],
                'facilityCode': '998',
                'facilityName': 'ABILENE (CAA)',
                'kind': 'Medication, Infusion',
                'lastUpdateTime': '20000121235900',
                'localId': '70V;I',
                'medStatus': 'urn:sct:392521001',
                'medStatusName': 'historical',
                'medType': 'urn:sct:105903003',
                'name': 'MORPH DRIP INJ',
                'orders': [
                    {
                        'locationName': '5 WEST PSYCH',
                        'locationUid': 'urn:va:location:9E7A:66',
                        'orderUid': 'urn:va:order:9E7A:8:11129',
                        'ordered': '199912221430',
                        'pharmacistName': 'RADTECH,SEVENTEEN',
                        'pharmacistUid': 'urn:va:user:9E7A:11733',
                        'predecessor': 'urn:va:med:9E7A:8:11127',
                        'providerName': 'PROGRAMMER,TWENTYEIGHT',
                        'providerUid': 'urn:va:user:9E7A:923',
                        'summary': 'MedicationOrder{uid=\'\'}'
                    }
                ],
                'overallStart': '199912222100',
                'overallStop': '200001212359',
                'pid': '9E7A;8',
                'products': [
                    {
                        'drugClassCode': 'urn:vadc:CN101',
                        'drugClassName': 'OPIOID ANALGESICS',
                        'ingredientCode': 'urn:va:vuid:4017530',
                        'ingredientCodeName': 'MORPHINE',
                        'ingredientName': 'MORPHINE INJ',
                        'ingredientRXNCode': 'urn:rxnorm:7052',
                        'ingredientRole': 'urn:sct:418804003',
                        'strength': '50 MG',
                        'summary': 'MedicationProduct{uid=\'\'}',
                        'suppliedCode': 'urn:va:vuid:4000975',
                        'suppliedName': 'MORPHINE SO4 15MG/ML INJ 50 MG'
                    },
                    {
                        'drugClassCode': 'urn:vadc:TN101',
                        'drugClassName': 'IV SOLUTIONS WITHOUT ELECTROLYTES',
                        'ingredientCode': 'urn:va:vuid:4017760',
                        'ingredientCodeName': 'DEXTROSE',
                        'ingredientName': 'DEXTROSE 5% IN WATER INJ,SOLN',
                        'ingredientRXNCode': 'urn:rxnorm:4850',
                        'ingredientRole': 'urn:sct:418297009',
                        'summary': 'MedicationProduct{uid=\'\'}',
                        'suppliedCode': 'urn:va:vuid:4014924',
                        'suppliedName': 'DEXTROSE 5% INJ,BAG,1000ML ',
                        'volume': '50 ML'
                    }
                ],
                'qualifiedName': 'MORPHINE INJ in DEXTROSE 5% IN WATER INJ,SOLN',
                'rxncodes': [
                    'urn:vandf:4017530',
                    'urn:ndfrt:N0000010582',
                    'urn:ndfrt:N0000000001',
                    'urn:ndfrt:N0000010595',
                    'urn:ndfrt:N0000007070',
                    'urn:rxnorm:7052',
                    'urn:vandf:4017760',
                    'urn:ndfrt:N0000010589',
                    'urn:ndfrt:N0000010582',
                    'urn:ndfrt:N0000000001',
                    'urn:rxnorm:4850',
                    'urn:ndfrt:N0000006402',
                    'urn:ndfrt:N0000146124'
                ],
                'stampTime': '20000121235900',
                'stopped': '200001212359',
                'summary': 'MORPHINE SO4 15MG/ML INJ 50 MG in DEXTROSE 5% INJ,BAG,1000ML  (EXPIRED)\nINFUSE OVER 35 MIN. Q8H ',
                'supply': false,
                'uid': 'urn:va:med:9E7A:8:11129',
                'vaStatus': 'EXPIRED',
                'vaType': 'V'
            }
        ]
    }
};

module.exports.data = {
    jdsData: jdsInput
};
