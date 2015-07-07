
@future
Feature: FHIR Load test

As a load tester

I want to verify that eVPR can handle a 'normal' load profile
So that I can be sure that the system will have adequate response for normal loads. Normal load includes anticipated peak period usage.


@future
Scenario: Load FHIR API with combined data domains and capture system response; Load with Low to Med volume

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "3" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Load FHIR API with combined data domains and capture system response; Load with Med to Heavy volume

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "6" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Load FHIR API with combined data domains and capture system response; Load with Heavy volume

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "12" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Load FHIR API with Allergies data domains and capture system response; user has record across 2 Vista instances

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "12" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Load FHIR API with Allergies data domains and capture system response; user has record across 4 Vista instances

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "12" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Load FHIR API with Vitals data domains and capture system response; user has record across 2 Vista instances

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "12" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Load FHIR API with Vitals data domains and capture system response; user has record across 4 Vista instances

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "12" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Load FHIR API with allergies data domains and capture system response; Load with Heavy volume

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "12" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Load FHIR API with vitals data domains and capture system response; Load with Heavy volume

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "12" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Load FHIR API with demographics data domains and capture system response; Load with Heavy volume

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "12" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients


@future
Scenario: Load FHIR API with labs data domains and capture system response; Load with Heavy volume

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "30" minutes
	When the load is increased by "12" requests per second after "0.05" minutes for "30" minutes
	Then at "30" minutes after the spike ends, the system response time still averages less than "2" seconds for cached patients

	