@REST
Feature: REST API Load test

As a load tester

I want to verify that eVPR can handle a 'normal' load profile
So that I can be sure that the system will have adequate response for normal loads. Normal load includes anticipated peak period usage.


@REST
Scenario Outline: Load FHIR API with combined data domains and capture system response; Load with Low to Med volume 

	Given that eVPR has ramped up with tag <tagStringBase> to a load of <BaseReqRate> requests per second after <BaseRampTime> minutes and continues for <BaseDuration> minutes
	When for test <ScenarioName> with tag <tagStringSpike> the load is increased by <SpikeRate> requests per second after <SpikeDelay> minutes for <SpikeDuration> minutes
	Then at <RelaxTime> minutes after the spike ends, the system response time still averages less than <FinalResponse> seconds for cached patients

Examples:
|ScenarioName         |BaseReqRate    |BaseRampTime   |BaseDuration   |SpikeRate      |SpikeDelay |SpikeDuration  |RelaxTime  |FinalResponse  |tagStringBase	|tagStringSpike	|
|"ehmp_REST"   |"0.0125"            |"20"            |"40"            |"0.0125"            |"12"        |"16"            |"20"        |"5"            |"@perf.ehmp_REST"	|"@perf.ehmp_REST"|

