@REST
Feature: REST API Load test

As a load tester

I want to verify that eVPR can handle a 'normal' load profile
So that I can be sure that the system will have adequate response for normal loads. Normal load includes anticipated peak period usage.

@REST
Scenario: Load FHIR API with combined data domains and capture system response; Load with Low to Med volume for short duration

	Given that eVPR has ramped up to a load of ".01" requests per second after "1" minutes and continues for "3" minutes
	When the load is increased by "0.04" requests per second after "1" minutes for "1" minutes
	Then at "2" minutes after the spike ends, the system response time still averages less than "5" seconds for cached patients

