@perf.vitals @perf
Feature: Load test - Vitals

Background:
   Given user has successfully logged into HMP

@perf.vitals_rest
Scenario: Client can request vitals
	Given a patient with vitals in multiple VistAs
	When the client requests vitals for that patient
	Then capture response time for "Patient-Vitals REST call"
	Then eHMP returns all vitals in the results
	And the results contain
		|field|value|
		|data.typeName|BLOOD PRESSURE|
		|data.uid|urn:va:vital:B362:3:24038|
		|data.result|80/30|
		|data.observed|20131015095502|
		|data.units|mm[Hg]|
	And the results contain
		|field|value|
		|data.typeName|PULSE|
		|data.uid|urn:va:vital:B362:3:24023|
		|data.result|Pass|
		|data.observed|201310060900|
		|data.units|/min|
	And the results contain
		|field|value|
		|data.typeName|RESPIRATION|
		|data.uid|urn:va:vital:B362:3:24024|
		|data.result|Pass|
		|data.observed|201310060900|
		|data.units|/min|
	And the results contain
		|field|value|
		|data.typeName|TEMPERATURE|
		|data.uid|urn:va:vital:B362:3:24025|
		|data.units|F|
	And the results contain
		|field|value|
		|data.typeName|PULSE OXIMETRY|
		|data.uid|urn:va:vital:B362:3:24026|
		|data.units|%|
	And the results contain
		|field|value|
		|data.typeName|HEIGHT|
		|data.uid|urn:va:vital:B362:3:24027|
		|data.units|in|
	And the results contain
		|field|value|
		|data.typeName|PAIN|
		|data.uid|urn:va:vital:B362:3:24028|
	And the results contain
		|field|value|
		|data.typeName|WEIGHT|
		|data.uid|urn:va:vital:B362:3:24029|
		|data.units|lb|

	
@vitals_search
Scenario: User can search for vitals in the eHMP UI
	Given a patient with vitals in multiple VistAs
    When user searches for "vital sign" for that patient
    Then capture response time for "Patient-Vital Sign Search"
    Then search results displays "1" titles
	When user opens title "Vital Sign"
	Then search results displays "8" summaries
		|summary_title|summary_date	|
		|BLOOD PRESSURE 80/30 mm[Hg] |25-Nov-2013 09:57|
		|PULSE Pass /min |25-Nov-2013 09:49|
		|RESPIRATION Pass /min |25-Nov-2013 09:49|
		|TEMPERATURE Pass F |25-Nov-2013 09:49|
		|PULSE OXIMETRY Pass % |25-Nov-2013 09:49|
		|HEIGHT Pass in |25-Nov-2013 09:49|
		|PAIN Pass|25-Nov-2013 09:49|
		|WEIGHT Pass lb |25-Nov-2013 09:49|
	Then view vitals search results
	    | path |
		|gridview-1321-record-ext-record-57|
		|gridview-1321-record-ext-record-58|
		|gridview-1321-record-ext-record-59|
		|gridview-1321-record-ext-record-60|
		|gridview-1321-record-ext-record-61|
		|gridview-1321-record-ext-record-62|



