@clinicalnotes_vpr 
Feature: F112 Return of Clinical Notes in VPR format 

#This feature item returns Clinical Notes in VPR format.

Background:
	Given a patient with pid "5000000009V082878" has been synced through Admin API
	

@f112_1_clinical_notes_vpr @vpr 
Scenario: Client can request clinical Note in VPR format
	Given a patient with "Clinical Notes" in multiple VistAs
	When the client requests document for the patient "5000000009V082878" in VPR format
	Then the client receives 2 VPR "VistA" result(s)
	Then the client receives 1 VPR "panorama" result(s)
	Then the VPR results contain:
                                                      
      | field                          | value                                                |
      | uid                            | urn:va:document:9E7A:100125:2258                     |
      | summary                        | ADMISSION REVIEW - NURSING                           |
      | pid                            | CONTAINS ;100125                                           |
      | kind                           | Progress Note                                        |
      | text.uid                       | urn:va:document:9E7A:100125:2258                     |
      | text.summary                   | DocumentText{uid='urn:va:document:9E7A:100125:2258'} |
      | text.dateTime                  | 20030428000508                                       |
      | text.status                    | COMPLETED                                            |
      | facilityCode                   | 998                                                  |
      | facilityName                   | ABILENE (CAA)                                        |
      | localId                        | 2258                                                 |
      | referenceDateTime              | 20030428000508                                       |
      | documentTypeCode               | PN                                                   |
      | documentTypeName               | Progress Note                                        |
      | documentClass                  | PROGRESS NOTES                                       |
      | localTitle                     | ADMISSION REVIEW - NURSING                           |
      | status                         | COMPLETED                                            |
      | statusDisplayName              | Completed                                            |
      | text.content                   | CONTAINS DATE/TIME: APR 27, 2003 20:53               |
      | text.clinicians.uid            | urn:va:user:9E7A:983                                 |
      | text.clinicians.summary        | DocumentClinician{uid='urn:va:user:9E7A:11748'}      |
      | text.clinicians.name           | PROVIDER,ONE                                         |
      | text.clinicians.displayName    | Provider,One                                         |
      | text.clinicians.role           | S                                                    |
      | clinicians.uid                 | urn:va:user:9E7A:983                                 |
      | clinicians.summary             | DocumentClinician{uid='urn:va:user:9E7A:11748'}      |
      | clinicians.name                | PROVIDER,ONE                                         |
      | clinicians.displayName         | Provider,One                                         |
      | clinicians.role                | S                                                    |
      | signer                         | PROVIDER,ONE                                         |
      | signedDateTime                 | 20030428000604                                       |
      | text.clinicians.signedDateTime | 20030428000604                                       |
      | text.clinicians.signature      | ONE PROVIDER                                         |
      | clinicians.signedDateTime      | 20030428000604                                       |
      | clinicians.signature           | ONE PROVIDER                                         |
      | entered                        | 20030428000508                                       |
      | documentDefUid                 | urn:va:doc-def:9E7A:1261                             |
      | encounterUid                   | urn:va:visit:9E7A:100125:3161                        |
      | encounterName                  | 3 NORTH SURG Apr 15, 2003                            |
      
@f112_2_clinical_notes_vpr @vpr 
Scenario: Client can request clinical Note in VPR format
	Given a patient with "Clinical Notes" in multiple VistAs
	When the client requests document for the patient "5000000009V082878" in VPR format
	Then the client receives 2 VPR "VistA" result(s)
	Then the client receives 1 VPR "kodak" result(s)
	Then the VPR results contain:
                                                      
      | field                          | value                                                |
      | uid                            | urn:va:document:C877:100125:2258                     |
      | summary                        | ADMISSION REVIEW - NURSING                           |
      | pid                            | CONTAINS ;100125                                     |
      | kind                           | Progress Note                                        |
      | text.uid                       | urn:va:document:C877:100125:2258                     |
      | text.summary                   | DocumentText{uid='urn:va:document:C877:100125:2258'} |
      | text.dateTime                  | 20030428000508                                       |
      | text.status                    | COMPLETED                                            |
      | facilityCode                   | 998                                                  |
      | facilityName                   | ABILENE (CAA)                                        |
      | localId                        | 2258                                                 |
      | referenceDateTime              | 20030428000508                                       |
      | documentTypeCode               | PN                                                   |
      | documentTypeName               | Progress Note                                        |
      | documentClass                  | PROGRESS NOTES                                       |
      | localTitle                     | ADMISSION REVIEW - NURSING                           |
      | status                         | COMPLETED                                            |
      | statusDisplayName              | Completed                                            |
      | text.content                   | CONTAINS DATE/TIME: APR 27, 2003 20:53               |
      | text.clinicians.uid            | urn:va:user:C877:983                                 |
      | text.clinicians.summary        | DocumentClinician{uid='urn:va:user:C877:11748'}      |
      | text.clinicians.name           | PROVIDER,ONE                                         |
      | text.clinicians.displayName    | Provider,One                                         |
      | text.clinicians.role           | S                                                    |
      | clinicians.uid                 | urn:va:user:C877:983                                 |
      | clinicians.summary             | DocumentClinician{uid='urn:va:user:C877:11748'}      |
      | clinicians.name                | PROVIDER,ONE                                         |
      | clinicians.displayName         | Provider,One                                         |
      | clinicians.role                | S                                                    |
      | signer                         | PROVIDER,ONE                                         |
      | signedDateTime                 | 20030428000604                                       |
      | text.clinicians.signedDateTime | 20030428000604                                       |
      | text.clinicians.signature      | ONE PROVIDER                                         |
      | clinicians.signedDateTime      | 20030428000604                                       |
      | clinicians.signature           | ONE PROVIDER                                         |
      | entered                        | 20030428000508                                       |
      | documentDefUid                 | urn:va:doc-def:C877:1261                             |
      | encounterUid                   | urn:va:visit:C877:100125:3161                        |
      | encounterName                  | 3 NORTH SURG Apr 15, 2003                            |
                        
                    
