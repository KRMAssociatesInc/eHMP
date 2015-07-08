@newsfeed @future

Feature: F144 eHMP Viewer GUI-News Feed: Summary View - Add News Feed Collection to RDK

@f144_1_newsfeed @VPR 

Scenario: A user can request newfeed information in VPR format through RDK API.
Given a patient with pid "9E7A;164" has been synced through the RDK API
When the client requests newsfeed for the patient "9E7A;164" in RDK format
Then a successful response is returned
And the client receives 9 result(s)
And the VPR results contain

      | field                               | value                         |
      | uid                                 | urn:va:visit:9E7A:164:H918    |
      | current                             | false                         |
      | facilityCode                        | 500                           |
      | facilityName                        | CAMP MASTER                   |
      | patientClassName                    | Inpatient                     |
      | dateTime                            | 199305201000                  |
      | service                             | MEDICINE                      |
      | locationUid                         | urn:va:location:9E7A:3        |
      | locationName                        | DRUGSTER                      |
      | shortLocationName                   | DRUGS                         |
      | locationDisplayName                 | Drugster                      |
      | movements.dateTime                  | 199305201300                  |
      | movements.localId                   | 920                           |
      | movements.movementType              | DISCHARGE                     |
      | movements.summary                   | CONTAINS EncounterMovement    |
      | kind                                | Admission                     |
      | pid                                 | 9E7A;164                      |
      | localId                             | H918                          |
      | typeName                            | HOSPITALIZATION               |
      | typeDisplayName                     | Hospitalization               |
      | patientClassCode                    | urn:va:patient-class:IMP      |
      | categoryCode                        | urn:va:encounter-category:AD  |
      | categoryName                        | Admission                     |
      | specialty                           | GENERAL MEDICINE              |
      | providers.role                      | A                             |
      | providers.providerUid               | urn:va:user:9E7A:1039         |
      | providers.providerName              | PROVIDER,TWENTYNINE           |
      | providers.providerDisplayName       | Provider,Twentynine           |
      | providers.summary                   | EncounterProvider{uid='null'} |
      | stay.arrivalDateTime                | 199305201000                  |
      | stay.dischargeDateTime              | 199305201300                  |
      | primaryProvider.primary             | true                          |
      | primaryProvider.role                | P                             |
      | primaryProvider.providerUid         | urn:va:user:9E7A:1039         |
      | primaryProvider.providerName        | PROVIDER,TWENTYNINE           |
      | primaryProvider.providerDisplayName | Provider,Twentynine           |
      | primaryProvider.summary             | EncounterProvider{uid='null'} |
      | reasonName                          | OBSERVATION	                |

	
	
	
	