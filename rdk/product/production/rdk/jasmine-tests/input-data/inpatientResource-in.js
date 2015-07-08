'use strict';
var inputValue = {
    'apiVersion': '1.0',
    'data': {
        'updated': 20141107042539,
        'totalItems': 224,
        'currentItemCount': 224,
        'items': [{
            'facilityCode': '998',
            'facilityName': 'ABILENE (CAA)',
            'overallStart': '200002101300',
            'overallStop': '200002222300',
            'vaType': 'I',
            'supply': false,
            'qualifiedName': 'FUROSEMIDE TAB',
            'administrations': [],
            'kind': 'Medication, Inpatient',
            'uid': 'urn:va:med:9E7A:8:12004',
            'summary': 'FUROSEMIDE TAB (EXPIRED)\n Give: ',
            'pid': '9E7A;8',
            'localId': '133U;I',
            'productFormName': 'TAB',
            'sig': 'Give: ',
            'stopped': '200002222300',
            'medStatus': 'urn:sct:392521001',
            'medStatusName': 'historical',
            'medType': 'urn:sct:105903003',
            'vaStatus': 'EXPIRED',
            'IMO': false,
            'products': [{
                'ingredientCode': 'urn:va:vuid:4017830',
                'ingredientCodeName': 'FUROSEMIDE',
                'ingredientName': 'FUROSEMIDE TAB',
                'drugClassCode': 'urn:vadc:CV702',
                'drugClassName': 'LOOP DIURETICS',
                'suppliedCode': 'urn:va:vuid:4002369',
                'suppliedName': 'FUROSEMIDE 20MG TAB',
                'summary': 'MedicationProduct{uid="null"}',
                'ingredientRole': 'urn:sct:410942007',
                'strength': '20 MG',
                'ingredientRXNCode': 'urn:rxnorm:4603'
            },
            {
                'ingredientCode': 'urn:va:vuid:11111',
                'ingredientCodeName': 'test',
                'ingredientName': 'test TAB',
                'drugClassCode': 'urn:vadc:CV702',
                'drugClassName': 'LOOP test',
                'suppliedCode': 'urn:va:vuid:4002369',
                'suppliedName': 'Ftest',
                'summary': 'test',
                'ingredientRole': 'urn:sct:410942007',
                'strength': '20 MG',
                'ingredientRXNCode': 'urn:rxnorm:4603'
            }],
            'dosages': [{
                'dose': 40,
                'amount': 'test',
                'noun': 'Test',
                'routeName': 'PO',
                'scheduleName': 'MO-WE-FR@08-13-19',
                'start': '200002101300',
                'stop': '200002222300',
                'relativeStart': 0,
                'relativeStop': 17880,
                'instructions': '20MG',
                'summary': 'MedicationDose{uid="null"}'
            },
            {
                'dose': 11,
                'amount': 'aaa',
                'noun': 'aaa',
                'routeName': 'aaa',
                'scheduleName': 'MO-WE-FR@08-13-19',
                'start': '200002101300',
                'stop': '200002222300',
                'relativeStart': 0,
                'relativeStop': 17880,
                'instructions': '20MG',
                'summary': 'aaa'
            }],
            'orders': [{
                'orderUid': 'urn:va:order:9E7A:8:12004',
                'ordered': '200002101046',
                'providerUid': 'urn:va:user:9E7A:923',
                'providerName': 'PROGRAMMER,TWENTYEIGHT',
                'pharmacistUid': 'urn:va:user:9E7A:923',
                'pharmacistName': 'PROGRAMMER,TWENTYEIGHT',
                'locationName': '5 WEST PSYCH',
                'locationUid': 'urn:va:location:9E7A:66',
                'summary': 'MedicationOrder{uid="null"}',
                'predecessor': 'urn:va:med:9E7A:8:10769',
                'successor': 'test'
            }],
            'fills': [],
            'codes': [{
                'code': '310429',
                'system': 'urn:oid:2.16.840.1.113883.6.88',
                'display': 'Furosemide 20 MG Oral Tablet'
            }],
            'rxncodes': [
                'urn:vandf:4017830',
                'urn:ndfrt:N0000008034',
                'urn:ndfrt:N0000000002',
                'urn:ndfrt:N0000007676',
                'urn:ndfrt:N0000008168',
                'urn:ndfrt:N0000007516',
                'urn:rxnorm:4603',
                'urn:ndfrt:N0000146188'
            ],
            'name': 'FUROSEMIDE TAB'
        }]
    }
};
module.exports.inputValue = inputValue;
