@perf.spikedelta
Feature: The need to exercise following features via Performance test framework and identity/remediate performance deficiencies:
[1] F93 Return of Allergies in FHIR format
[2] F93 Return of Vitals in FHIR format 
[3] F93 Return of Demographics in FHIR format
[4] F93 Return of Lab Results in FHIR format 

Background:
	Given background

@perf.spikedelta 
Scenario: User, with 10 allergies record, requests direct REST call to FHIR api end-points
    When the client requests allergies from VPR for the patient, "B362;100022" 
    Then print system time