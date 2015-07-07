@perf.allergies @perf
Feature: Load test - Allergies

Background:
   Given user has successfully logged into HMP


@perf.allergies_rest
Scenario: Client can request allergies
	Given a patient with allergies in multiple VistAs
	When the client requests allergies for that patient
    Then eHMP returns all allergies in the results
    Then capture response time for "Patient-Allergies REST call"

 
@perf.allergies_view
Scenario: User can view requested allergies in the eHMP UI
	Given a patient with allergies in multiple VistAs
	When user requests allergies for that patient
	When user search for "allergy / adverse reaction" for that patient
	Then capture response time for "Patient-Allergies Search"
	Then view allergies search results
    | path |
	|gridview-1321-record-ext-record-57|
	|gridview-1321-record-ext-record-58|
	|gridview-1321-record-ext-record-59|
	|gridview-1321-record-ext-record-60|
	|gridview-1321-record-ext-record-61|
	|gridview-1321-record-ext-record-62|
	|gridview-1321-record-ext-record-63|
	|gridview-1321-record-ext-record-64|
	|gridview-1321-record-ext-record-65|
	|gridview-1321-record-ext-record-66|
	|gridview-1321-record-ext-record-67|

