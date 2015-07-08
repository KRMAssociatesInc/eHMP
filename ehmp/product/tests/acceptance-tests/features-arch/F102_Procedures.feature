@Procedures @future
Feature: F102 Access and Verify the procedures in the hmp system
# This feature file has UI test and the background UI rest request.  Since we don't want either to run in the jenkins pipeline
# I have marked the Feature as @future so the background step will also not be run

Background:
	Given a patient with pid "10110" has been synced through FHIR
   
@procedures_rest
Scenario: Client can request procedures
	Given a patient with "procedures" in multiple VistAs
	When the client requests procedures for the patient "10110"
	#Then eHMP returns all procedures in the results
	Then eHMP returns "27" result(s)
	And the results contain data group
      | field          | value                                 |
      | name           | HOLTER                                |
      | uid            | urn:va:procedure:9E7A:8:1;MCAR(691.6, |
      | facilityName   | CAMP MASTER                           |
      | facilityCode   | 500                                   |
      | dateTime       | 198808051457                          |
      | statusName     | COMPLETE                              |
      | localId        | 1;MCAR(691.6,                         |
      | pid            | 10110                                 |
      | kind           | Procedure                             |
      | Category       | CP                                    |
      | interpretation | BORDERLINE                            |
	And the results contain data group
      | field          | value                                |
      | name           | COLONOSCOPY                          |
      | uid            | urn:va:procedure:9E7A:8:41;MCAR(699, |
      | facilityName   | CAMP MASTER                          |
      | facilityCode   | 500                                  |
      | dateTime       | 199603181418                         |
      | statusName     | COMPLETE                             |
      | localId        | 41;MCAR(699,                         |
      | pid            | 10110                                |
      | kind           | Procedure                            |
      | Category       | CP                                   |
      | interpretation | ABNORMAL                             |

@procedures_search @UI
Scenario: User can search for procedures in the eHMP UI
	Given user has successfully logged into HMP
	And a patient with procedures in multiple VistAs
    When user searches for "clinical procedure" for that patient
	Then search results displays "1" titles
	When user opens title "Clinical Procedure"
	Then search results include
      | summary_title | summary_date      |
      | COL           | 18-Mar-1996 14:18 |
      | HOLTER        | 05-Aug-1988 14:57 |

		
			
		