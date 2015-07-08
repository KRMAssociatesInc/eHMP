@Radiology
Feature: F20 Radiology Reports
  If Radiology Report data is requested for a patient, or a change to Radiology Report data is detected for a patient, that data will be returned for all VistA instances in which Radiology Report data exists for that patient, stored in the LEIPR, and displayed in the JLV.

@US485
Scenario: VistA Exchange supports request, retrieval, storage, and display of Radiology Report data from multiple VistA instances for a patient
  Given a patient with id "E105" has not been synced
  When a client requests "radiology" for patient with id "E105"
  Then a successful response is returned within "60" seconds
  And that patient has Radiology Report data at multiple VistA instances
    | field                                         | panorama_value                           | kodak_value                           |
    | contained[DiagnosticOrder].identifier.label   | MYOCARDIAL PERFUSION SCAN W/PHARM STRESS | CARDIAC MYOPERFUSION SCAN DRUG STRESS |
 
  Then a response is returned with Radiology Report data from multiple VistA instances for that patient from LEIPR
    | Radiology_fields_list                         | Radiology_values                          | Required_fields |
    | status                                        | registered                                | Yes |
    | issued                                        | 2006-09-13T01:00:00                       | Yes |
    | subject.reference                             | Patient/E105                              | Yes |
    | identifier.system                             | urn:oid:2.16.840.1.113883.6.233           | Yes |
    | identifier.value[String]                      | urn:va:542GA:100840:rad:6939086.8999-1    | Yes |
    | text.status                                   | generated                                 | Yes |
    | text.div                                      | "<div>&lt;div&gt;Exam Date: 2006-09-13T01:00:00&lt;br&gt;Report Date: 2006-09-13T01:00:00&lt;br&gt;Test: RADIOLOGIC EXAMINATION, CHEST, 2 VIEWS, FRONTAL AND LATERAL;&lt;br&gt;Status: registered&lt;br&gt;Imaging Location: null&lt;br&gt;&lt;/div&gt;</div>" | Yes |
    | contained[Organization]._id                   |                                           | Yes |
    | contained[Organization].identifier.system     | urn:oid:2.16.840.1.113883.6.233           | Yes |
    | contained[Organization].identifier.value      | 500                                       | Yes |
    | contained[Organization].name                  | CAMP MASTER                               | Yes |
    | performer.reference                           |                                           | Yes |
    | diagnosticDateTime                            | 2006-09-13T01:00:00                       | Yes |
    | results.name.coding[].code                    | 71020                                     | Yes |
    | results.name.coding[].display                 | CHEST 2 VIEWS PA&LAT                      | Yes |
    | results.name.coding[].system                  | 2.16.840.1.113883.6.12                    | Yes |
    | results.name.text                             | RADIOLOGIC EXAMINATION, CHEST, 2 VIEWS, FRONTAL AND LATERAL; | Yes |
    | extension[examStatus].url                     | "http://vistacore.us/fhir/profiles/@main#examStatus"         | No  |
    | extension[examStatus].valueString             | WAITING FOR EXAM                                             | No  |
    | extension[hasImages].url                      | "http://vistacore.us/fhir/profiles/@main#hasImages"          | No  |
    | extension[hasImages].valueString              | 0                                                            | No  |
    | extension[imagingType].url                    | "http://vistacore.us/fhir/profiles/@main#imagingType"        | No  |
    | extension[imagingType].valueString            | RAD                                                          | No  |
    | extension[imagingTypeDesc].url                | "http://vistacore.us/fhir/profiles/@main#imagingTypeDesc"    | No  |
    | extension[imagingTypeDesc].valueString        | GENERAL RADIOLOGY                                            | No  |
    | extension[providerId].url                     | "http://vistacore.us/fhir/profiles/@main#ProviderId"         | No  |
    | extension[providerId].valueString             | 11716                                                        | No  |
    | extension[providerName].url                   | "http://vistacore.us/fhir/profiles/@main#ProviderName"       | No  |
    | extension[providerName].valueString           | RADIOLOGIST,ONE                                              | No  |
    | extension[location].url                       | "http://vistacore.us/fhir/profiles/@main#locationId"         | No  |
    | extension[location].valueString               | 40                                                           | No  |
    | extension[locationName].url                   | "http://vistacore.us/fhir/profiles/@main#locationName"       | No  |
    | extension[locationName].valueString           | RADIOLOGY MAIN FLOOR                                         | No  |
    | contained[DiagnosticOrder].identifier.label   | CHEST 2 VIEWS PA&LAT                                         | No  |
    | contained[DiagnosticOrder].identifier.system  | 2.16.840.1.113883.6.12                                       | No  |
    | contained[DiagnosticOrder].identifier.value   | 33248                                                        | No  |
    | requestDetail.reference                       |                                                              | Yes |


#   Note: The patient E105 does not have data for 'encounter' fields. We used patient E9 to cover the aboue test. 
@US485
Scenario: VistA Exchange supports request, retrieval, storage, and display of Radiology Report data from multiple VistA instances for a patient
  Given a patient with id "E9" has not been synced
  When a client requests "radiology" for patient with id "E9"
  Then a successful response is returned within "60" seconds
  Then a response is returned with Radiology Report data from multiple VistA instances for that patient from LEIPR
	| Radiology_fields_list                			| Radiology_values                                      | Required_fields |
	| subject.reference 							| Patient/E9                                            | Yes |
	| extension[encounter].url                      | "http://vistacore.us/fhir/profiles/@main#encounter"   | No  |
	| extension[encounter].valueString              |  232                                                  | No  |




#   Note: The below fields are not available from RPC
#   | conclussion                                          | | No |
#   | codedDiagnosis                                       | | No |
#   | presentedForm                                        | | No |
#   And the results can be viewed in JLV    
