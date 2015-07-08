'use strict';
var inputValue = {
    'apiVersion': '1.0',
    'data': {
        'updated': 20141113070019,
        'totalItems': 42,
        'currentItemCount': 42,
        'items': [
            {
                'facilityCode': '500',
                'facilityName': 'CAMP MASTER',
                'overallStart': '20100227',
                'overallStop': '20110228',
                'vaType': 'O',
                'supply': false,
                'lastFilled': '20100227',
                'qualifiedName': 'METOPROLOL TARTRATE TAB',
                'administrations': [],
                'kind': 'Medication, Outpatient',
                'units': 'MG',
                'uid': 'urn:va:med:9E7A:229:27952',
                'summary': 'METOPROLOL TARTRATE 50MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY',
                'pid': '9E7A;229',
                'localId': '403946;O',
                'productFormName': 'TAB',
                'sig': 'TAKE ONE TABLET BY MOUTH TWICE A DAY',
                'patientInstruction': '',
                'stopped': '20110228',
                'medStatus': 'urn:sct:392521001',
                'medStatusName': 'historical',
                'medType': 'urn:sct:73639000',
                'vaStatus': 'EXPIRED',
                'IMO': false,
                'products': [
                    {
                        'ingredientCode': 'urn:va:vuid:4019836',
                        'ingredientCodeName': 'METOPROLOL',
                        'ingredientName': 'METOPROLOL TARTRATE TAB',
                        'drugClassCode': 'urn:vadc:CV100',
                        'drugClassName': 'BETA BLOCKERS/RELATED',
                        'suppliedCode': 'urn:va:vuid:4004608',
                        'suppliedName': 'METOPROLOL TARTRATE 50MG TAB',
                        'summary': 'MedicationProduct{uid="null"}',
                        'ingredientRole': 'urn:sct:410942007',
                        'strength': '50 MG',
                        'ingredientRXNCode': 'urn:rxnorm:6918'
                    }
                ],
                'dosages': [
                    {
                        'dose': '50',
                        'units': 'MG',
                        'routeName': 'PO',
                        'scheduleName': 'BID',
                        'scheduleType': 'CONTINUOUS',
                        'start': '20100227',
                        'stop': '20110228',
                        'relativeStart': 0,
                        'relativeStop': 527040,
                        'scheduleFreq': 720,
                        'amount': '1',
                        'noun': 'TABLET',
                        'instructions': '50MG',
                        'summary': 'MedicationDose{uid="null"}'
                    }
                ],
                'orders': [
                    {
                        'orderUid': 'urn:va:order:9E7A:229:27952',
                        'successor': 'test2',
                        'predecessor': 'test',
                        'prescriptionId': '500724',
                        'ordered': '201002270903',
                        'providerUid': 'urn:va:user:9E7A:983',
                        'providerName': 'PROVIDER,ONE',
                        'pharmacistUid': 'urn:va:user:9E7A:10000000056',
                        'pharmacistName': 'PHARMACIST,ONE',
                        'fillCost': '2.466',
                        'locationName': 'GENERAL MEDICINE',
                        'locationUid': 'urn:va:location:9E7A:23',
                        'quantityOrdered': '180',
                        'daysSupply': 90,
                        'fillsAllowed': 3,
                        'fillsRemaining': 3,
                        'vaRouting': 'W',
                        'summary': 'MedicationOrder{uid="null"}'
                    }
                ],
                'fills': [
                    {
                        'dispenseDate': '20100227',
                        'releaseDate': '20100227',
                        'quantityDispensed': '180',
                        'daysSupplyDispensed': 90,
                        'routing': 'W',
                        'summary': 'MedicationFill{uid="null"}'
                    }
                ],
                'codes': [
                    {
                        'code': '866514',
                        'system': 'urn:oid:2.16.840.1.113883.6.88',
                        'display': 'Metoprolol Tartrate 50 MG Oral Tablet'
                    }
                ],
                'rxncodes': [
                    'urn:vandf:4019836',
                    'urn:ndfrt:N0000010595',
                    'urn:ndfrt:N0000000001',
                    'urn:ndfrt:N0000010582',
                    'urn:rxnorm:6918',
                    'urn:ndfrt:N0000007508'
                ],
                'name': 'METOPROLOL TARTRATE TAB',
                'type': 'Prescription'
            }
        ]
    }
};

module.exports.inputValue = inputValue;
