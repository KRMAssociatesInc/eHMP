@clear_cache @single
Feature: F108 VistA Exchange Cache: Delete Patient Data for a single patient from the Cache (Clear patient from the JDS Cache)

@mutliple_server_clear
Scenario: Request to unsync a patient, followed by patient search
	Given a patient with pid "5000000217V519385" has been synced through Admin API
	When the user searches for a patient "Eight,Inpatient" in VPR format
	Then corresponding matching records totaling "2" are displayed
	When the client requests that the patient "5000000217V519385" be cleared from the cache
	Then a successful response is returned within 60 seconds
	And the patient with pid "5000000217V519385" is cleared within 30 seconds
	When a patient with pid "5000000217V519385" has been synced through Admin API
	When the user searches for a patient "Eight,Inpatient" in VPR format
	Then corresponding matching records totaling "2" are displayed
	

@f108_1_clear_cache_sync_delete_patient
Scenario: Request to unsync a patient
	Given a patient with pid "10104V248233" has been synced through Admin API
	When the client requests that the patient "10104V248233" be cleared from the cache
	Then a successful response is returned within 60 seconds
	And the patient with pid "10104V248233" is cleared within 30 seconds

