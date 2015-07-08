'use strict';
var inputValue = {
    'apiVersion': '1.0',
    'data': {
        'updated': 20141022091512,
        'totalItems': 4,
        'currentItemCount': 4,
        'items': [{
            'authorUid': 'urn:va:user:9E7A:10000000049',
            'authorDisplayName': 'Labtech,Fiftynine',
            'signerUid': 'urn:va:user:9E7A:10000000049',
            'signerDisplayName': 'Labtech,Fiftynine',
            'signedDateTime': '20070516094554',
            'kind': 'Advance Directive',
            'documentDefUid': 'urn:va:doc-def:9E7A:1632',
            'interdisciplinaryType': '',
            'isInterdisciplinary': 'true',
            'facilityCode': '500',
            'facilityName': 'CAMP MASTER',
            'referenceDateTime': '200705160947',
            'documentTypeCode': 'D',
            'documentTypeName': 'Advance Directive',
            'documentClass': 'PROGRESS NOTES',
            'localTitle': 'ADVANCE DIRECTIVE COMPLETED',
            'nationalTitle': {
                'name': 'ADVANCE DIRECTIVE',
                'vuid': 'urn:va:vuid:4693421'
            },
            'documentDefUidVuid': 'urn:va:vuid:4693421',
            'uid': 'urn:va:document:9E7A:253:3852',
            'summary': 'ADVANCE DIRECTIVE COMPLETED',
            'sensitive': 'false',
            'dodComplexNoteUri': '',
            'pid': '9E7A;253',
            'author': 'LABTECH,FIFTYNINE',
            'signer': 'LABTECH,FIFTYNINE',
            'subject': 'Subject1',
            'entered': '20070516094554',
            'text': [{
                'clinicians': [{
                    'name': 'LABTECH,FIFTYNINE',
                    'displayName': 'Labtech,Fiftynine',
                    'role': 'AU',
                    'uid': 'urn:va:user:9E7A:10000000049',
                    'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000049"}'
                }, {
                    'name': 'LABTECH,FIFTYNINE',
                    'displayName': 'Labtech,Fiftynine',
                    'role': 'S',
                    'signedDateTime': '20070516094554',
                    'signature': 'FIFTYNINE LABTECH',
                    'uid': 'urn:va:user:9E7A:10000000049',
                    'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000049"}'
                }, {
                    'name': 'LABTECH,FIFTYNINE',
                    'displayName': 'Labtech,Fiftynine',
                    'role': 'ES',
                    'uid': 'urn:va:user:9E7A:10000000049',
                    'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000049"}'
                }, {
                    'name': 'MG',
                    'displayName': 'Mg',
                    'role': 'E',
                    'uid': 'urn:va:user:9E7A:10000000049',
                    'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000049"}'
                }],
                'content': '   VistA Imaging - Scanned Document\r\n',
                'dateTime': '200705160947',
                'status': 'COMPLETED',
                'authorUid': 'urn:va:user:9E7A:10000000049',
                'authorDisplayName': 'Labtech,Fiftynine',
                'signerUid': 'urn:va:user:9E7A:10000000049',
                'signer': 'LABTECH,FIFTYNINE',
                'signerDisplayName': 'Labtech,Fiftynine',
                'author': 'LABTECH,FIFTYNINE',
                'uid': 'urn:va:document:9E7A:253:3852',
                'summary': 'DocumentText{uid="urn:va:document:9E7A:253:3852"}',
                'uidHref': 'http://localhost:8888/patientrecord/uid?pid=C877%3B253&uid=urn%3Ava%3Adocument%3A9E7A%3A253%3A3852'
            }],
            'codes': [],
            'localId': '3852',
            'encounterUid': 'urn:va:visit:9E7A:253:5669',
            'encounterName': '20 MINUTE May 16, 2007',
            'urgency': 'normal',
            'status': 'COMPLETED',
            'statusDisplayName': 'Completed',
            'clinicians': [{
                'name': 'LABTECH,FIFTYNINE',
                'displayName': 'Labtech,Fiftynine',
                'role': 'AU',
                'uid': 'urn:va:user:9E7A:10000000049',
                'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000049"}'
            }, {
                'name': 'LABTECH,FIFTYNINE',
                'displayName': 'Labtech,Fiftynine',
                'role': 'S',
                'signedDateTime': '20070516094554',
                'signature': 'FIFTYNINE LABTECH',
                'uid': 'urn:va:user:9E7A:10000000049',
                'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000049"}'
            }, {
                'name': 'LABTECH,FIFTYNINE',
                'displayName': 'Labtech,Fiftynine',
                'role': 'ES',
                'uid': 'urn:va:user:9E7A:10000000049',
                'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000049"}'
            }, {
                'name': 'MG',
                'displayName': 'Mg',
                'role': 'E',
                'uid': 'urn:va:user:9E7A:10000000049',
                'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000049"}'
            }],
            'uidHref': 'http://localhost:8888/patientrecord/uid?pid=9E7A%3B253&uid=urn%3Ava%3Adocument%3A9E7A%3A253%3A3852'
        }, {
            'authorUid': 'urn:va:user:9E7A:10000000225',
            'authorDisplayName': 'User,Leipr',
            'kind': 'Allergy/Adverse Reaction',
            'documentDefUid': 'urn:va:doc-def:9E7A:17',
            'isInterdisciplinary': 'false',
            'facilityCode': '500',
            'facilityName': 'CAMP MASTER',
            'referenceDateTime': '20141014093251',
            'documentTypeCode': 'A',
            'documentTypeName': 'Allergy/Adverse Reaction',
            'documentClass': 'PROGRESS NOTES',
            'localTitle': 'Adverse React/Allergy',
            'uid': 'urn:va:document:9E7A:100022:4058',
            'summary': 'Adverse React/Allergy',
            'sensitive': 'true',
            'dodComplexNoteUri': '',
            'pid': '9E7A;100022',
            'author': 'USER,LEIPR',
            'entered': '20141014093251',
            'subject': 'Subject2',
            'text': [{
                'clinicians': [{
                    'name': 'USER,LEIPR',
                    'displayName': 'User,Leipr',
                    'role': 'AU',
                    'uid': 'urn:va:user:9E7A:10000000225',
                    'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000225"}'
                }, {
                    'name': 'USER,LEIPR',
                    'displayName': 'User,Leipr',
                    'role': 'ES',
                    'uid': 'urn:va:user:9E7A:10000000225',
                    'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000225"}'
                }, {
                    'name': 'LU',
                    'displayName': 'Lu',
                    'role': 'E',
                    'uid': 'urn:va:user:9E7A:10000000225',
                    'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000225"}'
                }],
                'content': 'This patient has had the following reactions \r\nsigned-off on Oct 14, 2014@09:32:51.\r\n\r\nERYTHROMYCIN\r\n\r\n',
                'dateTime': '20141014093251',
                'status': 'UNSIGNED',
                'authorUid': 'urn:va:user:9E7A:10000000225',
                'authorDisplayName': 'User,Leipr',
                'author': 'USER,LEIPR',
                'uid': 'urn:va:document:9E7A:100022:4058',
                'summary': 'DocumentText{uid="urn:va:document:9E7A:100022:4058"}',
                'uidHref': 'http://localhost:8888/patientrecord/uid?pid=9E7A%3B100022&uid=urn%3Ava%3Adocument%3A9E7A%3A100022%3A4058'
            }],
            'codes': [],
            'localId': '4058',
            'encounterUid': 'urn:va:visit:9E7A:100022:3050',
            'encounterName': 'BCMA Jan 30, 2002',
            'urgency': 'normal',
            'status': 'ACTIVE',
            'statusDisplayName': 'Unsigned',
            'clinicians': [{
                'name': 'USER,LEIPR',
                'displayName': 'User,Leipr',
                'role': 'AU',
                'uid': 'urn:va:user:9E7A:10000000225',
                'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000225"}'
            }, {
                'name': 'USER,LEIPR',
                'displayName': 'User,Leipr',
                'role': 'ES',
                'uid': 'urn:va:user:9E7A:10000000225',
                'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000225"}'
            }, {
                'name': 'LU',
                'displayName': 'Lu',
                'role': 'E',
                'uid': 'urn:va:user:9E7A:10000000225',
                'summary': 'DocumentClinician{uid="urn:va:user:9E7A:10000000225"}'
            }],
            'uidHref': 'http://localhost:8888/patientrecord/uid?pid=9E7A%3B100022&uid=urn%3Ava%3Adocument%3A9E7A%3A100022%3A4058'
        }]
    }
};
module.exports.inputValue = inputValue;
