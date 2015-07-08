@problem_vpr 
Feature: F282 Conditions Gist View  

#This Feature item returns the Problem List in VPR format.


@f282_1_problem_vpr @vpr @US3848
Scenario: Client can request the Problem List in VPR format
	Given a patient with "problem list results" in multiple VistAs
      Given a patient with pid "9E7A;129" has been synced through Admin API
	When the client requests problem lists for the patient "9E7A;129" in VPR format
	Then the client receives 16 VPR "VistA" result(s)
	Then the client receives 16 VPR "panorama" result(s)
	Then the VPR results contain:
      | field               | value                             |
      | uid                 | urn:va:problem:9E7A:129:111       |
      | summary             | VACCIN FOR MUMPS (ICD-9-CM V04.6) |
      | pid                 | 9E7A;129                          |
      | localId             | 111                               |
      | encounters.dateTime | 199901270900                      |
      | encounters.visitUid | urn:va:visit:9E7A:129:1584        |
      | encounters.dateTime | 199902080800                      |
      | encounters.visitUid | urn:va:visit:9E7A:129:1573        |
      | encounters.dateTime | 199903100900                      |
      | encounters.visitUid | urn:va:visit:9E7A:129:1610        |
      
@f282_2_problem_vpr @vpr @US4000
Scenario: Client can request the Problem List in VPR format which return documents related to problems and visits
      Given a patient with "problem list results" in multiple VistAs
      Given a patient with pid "9E7A;129" has been synced through Admin API
      When the client requests problem lists for the patient "9E7A;129" in VPR format
      Then the client receives 16 VPR "VistA" result(s)
      Then the client receives 16 VPR "panorama" result(s)
      Then the VPR results contain:
      | field                 | value                             |
      | uid                   | urn:va:problem:9E7A:129:111       |
      | summary               | VACCIN FOR MUMPS (ICD-9-CM V04.6) |
      | pid                   | 9E7A;129                          |
      | localId               | 111                               |
      | documents.documentUid | urn:va:document:9E7A:129:1009     |
      | documents.documentUid | urn:va:document:9E7A:129:1023     |
     
     