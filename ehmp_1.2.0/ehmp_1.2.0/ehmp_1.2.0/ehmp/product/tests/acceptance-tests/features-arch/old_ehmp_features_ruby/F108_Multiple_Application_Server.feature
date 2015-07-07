
@multiple_server

Feature: F108 Multiple VistA Exchange Application Servers

#This feature item synchs a patient only to the cache for the VE application server on which the request is processed.

Background:
	Given a patient with pid "11016V630869" has not been synced in FHIR format on "VE1"
	And a patient with pid "11016V630869" has not been synced in FHIR format on "VE2"

@multiple_server
Scenario: Patient subscribed to primary VistA site against HMP VE cache
	When the client requests synced through FHIR for patient with pid "11016V630869" on "VE1"
	Then a successful response is returned
	And the patient with pid "11016V630869" has no data on "VE2"
	When the client requests synced through FHIR for patient with pid "11016V630869" on "VE2"
	Then a successful response is returned
	And the patient with pid "11016V630869" have the same data on both server


