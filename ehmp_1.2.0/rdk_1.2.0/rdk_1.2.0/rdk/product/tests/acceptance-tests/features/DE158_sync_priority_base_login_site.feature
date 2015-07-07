@sync_priority @unstable
Feature: F142 VX Cache Management and Expiration/Sync Stabilization
           

@DE158_1
Scenario: Client can request lab (Chem/Hem) results in FHIR format and receive data from login site without waiting for other site to sync.
	Given a patient with "lab (Chem/Hem) results" in multiple VistAs
	And the client requests that the patient with pid "11016V630869" be cleared through the RDK API
	When the client requests lab "(Chem/Hem)" results for that patient "11016V630869"
	Then a successful response is returned
	And the client receives 46 FHIR "panorama" result(s)


@DE158_2
Scenario: Client can request Radiology Reports in FHIR format and receive data from login site without waiting for other site to sync.
  Given a patient with "radiology report results" in multiple VistAs
  And the client requests that the patient with pid "10107V395912" be cleared through the RDK API
  When the client requests radiology report results for the patient "10107V395912" in FHIR format
  Then a successful response is returned
  And the client receives 1 FHIR "panorama" result(s)


  @DE158_3
  Scenario: Client can request vital results in FHIR format and receive data from login site without waiting for other site to sync.
	Given a patient with "vitals" in multiple VistAs
    And the client requests that the patient with pid "11016V630869" be cleared through the RDK API
	When the client "C877;pu1234" requests vitals for the patient "11016V630869" in FHIR format
	Then a successful response is returned
	And the client receives 61 FHIR "kodak" result(s)




      
      
  

