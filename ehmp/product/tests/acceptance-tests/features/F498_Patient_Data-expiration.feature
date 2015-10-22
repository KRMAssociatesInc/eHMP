@patient_data_expiration @us5871

Feature: F498 VX Cache Management and Expiration/Sync Stabilization

@forced_sync
Scenario: Secondary site data expiration times rules engine should be ignored when forced sync used.
	Given a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DoD;HDR;Vler" site(s)
	And save the stamp time for site(s) "DoD;HDR;Vler"
	When the client forced sync for patient with pid "9E7A;227" at "DoD" secondary site(s)
	Then the stamp time should get updated for site(s) "DoD" but Not for "HDR;Vler"
	And save the stamp time for site(s) "DoD;HDR;Vler"
	When the client forced sync for patient with pid "9E7A;227" at "HDR;Vler" secondary site(s)
	Then the stamp time should get updated for site(s) "HDR;Vler" but Not for "DoD"
	And save the stamp time for site(s) "DoD;HDR;Vler"
	When the client forced sync for patient with pid "9E7A;227" at "all" secondary site(s)
	Then the stamp time should get updated for site(s) "DoD;HDR;Vler" but Not for ""