@timeline @US2845 @vxsync @patient

Feature: F295 - Encounters Applet 

@f295_1_timeline @VPR @US2845 @9E7A164

Scenario: Timeline: Add additional data types Appointment and Lab results
Given a patient with pid "9E7A;164" has been synced through the RDK API
When the client requests timeline for the patient "9E7A;164" in RDK format
Then a successful response is returned
And the client receives 14 result(s)
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
      | providers.summary                   | EncounterProvider{uid=''} |
      | stay.arrivalDateTime                | 199305201000                  |
      | stay.dischargeDateTime              | 199305201300                  |
      | primaryProvider.primary             | true                          |
      | primaryProvider.role                | P                             |
      | primaryProvider.providerUid         | urn:va:user:9E7A:1039         |
      | primaryProvider.providerName        | PROVIDER,TWENTYNINE           |
      | primaryProvider.providerDisplayName | Provider,Twentynine           |
      | primaryProvider.summary             | EncounterProvider{uid=''} |
      | reasonName                          | OBSERVATION	                |
     

@f295_2_timeline @VPR @US2845 @9E7A164

Scenario: Timeline: Add additional data types Appointment and Lab results
Given a patient with pid "9E7A;164" has been synced through the RDK API
When the client requests timeline for the patient "9E7A;164" in RDK format
Then a successful response is returned
And the client receives 14 result(s)
And the VPR results contain
      | field            | value                                                                    |
      | uid              | urn:va:lab:9E7A:164:CH;7039894.9085;80                                   |
      | facilityCode     | 500                                                                      |
      | facilityName     | CAMP MASTER                                                              |
      | groupName        | CH 0104 20                                                               |
      | activityDateTime | 199601040915                                                             |
      | groupUid         | urn:va:accession:9E7A:164:CH;7039894.9085                                |
      | categoryCode     | urn:va:lab-category:CH                                                   |
      | categoryName     | Laboratory                                                               |
      | observed         | 199601040915                                                             |
      | resulted         | 199601041129                                                             |
      | specimen         | SERUM                                                                    |
      | comment          | CONTAINS AMYLASE reported incorrectly as 55 Ordering Provider: Twentytwo |
      | typeCode         | urn:va:ien:60:244:72                                                     |
      | displayName      | HDL                                                                      |
      | result           | 50                                                                       |
      | units            | MG/DL                                                                    |
      | low              | 40                                                                       |
      | high             | 60                                                                       |
      | kind             | Laboratory                                                               |
      | resultNumber     | 50                                                                       |
      | abnormal         | false                                                                    |
      | micro            | false                                                                    |
      | qualifiedName    | HDL (SERUM)                                                              |
      | summary          | HDL (SERUM) 50 MG/DL                                                     |
      | pid              | 9E7A;164                                                                 |
      | localId          | CH;7039894.9085;80                                                       |
      | typeName         | HDL                                                                      |
      | statusCode       | urn:va:lab-status:completed                                              |
      | statusName       | completed                                                                |
      | displayOrder     | 3.9                                                                      |
      | typeId           | 244                                                                      |
      | sample           |                                                                          |
      | facilityDisplay  | Camp Master                                                              |
      | facilityMoniker  | TST1                                                                     |
      | lnccodes         | urn:va:ien:60:244:72                                                     |

	
	
	
