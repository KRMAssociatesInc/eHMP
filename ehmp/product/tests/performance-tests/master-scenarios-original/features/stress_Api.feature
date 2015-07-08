
@future
Feature: FHIR Stress test

As a load tester

I want to stress the EHMP system until it fails, to observe the failure ponts and failure modes
So that I can discover the signs that precede failure.


@future
Scenario: Stress FHIR API with combined data domains till it breaks; Stress with Heavy request volume

	Given that eVPR has ramped up to a load of "3" requests per second after "0.05" minutes and continues for "1.0" minutes
	When the load is increased by "100" requests per second after "30" minutes for "15" minutes


@future
Scenario: Stress FHIR API with combined data domains till it breaks; Stress with heavy dynamic data volume

	Given that eVPR has ramped up to a load of "25" requests per second after "20.0" minutes and continues for "30" minutes
	When the load is increased by "100" request per second of very large data volulme requests after "30" minutes for "15" minutes.


@future
Scenario: Stress FHIR API with combined data domains till it breaks; Stress with heavy static data volume

	Given that eVPR has been loaded with a very large volume of cached data
	When the load is increased to "100" request per second after "30" minutes for "15" minutes.

	
@Manual
Scenario: Stress while CPU of JDS is above 80% usage


@Manual
Scenario: Stress while DISC Capacity of JDS is above 80% usage

