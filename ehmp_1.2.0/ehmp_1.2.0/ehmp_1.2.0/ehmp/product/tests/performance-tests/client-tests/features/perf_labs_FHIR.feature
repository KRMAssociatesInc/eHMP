@Perf_labs_FHIR
Feature: Initial performance test run for Labs. In this feature there will be initial performance test runs in AWS to make sure the expected SLAs are met for Labs

Background:
	Given patients has been synced for FHIR test
	
@future @perf_fhir
Scenario: Invoke a certain number of transactions per second for a period of time
	Given a patient with "lab (Chem/Hem) results" in multiple VistAs
	When 10 transaction per second for 10 seconds is sent
	Then a successful response is returned
	And the response time is captured