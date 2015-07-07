@DischargeSummary @US1418 @single
Feature: F116 Return and display of discharge summary records with VA and DoD data


@dischargesummary
Scenario: Client can request discharge summary
  Given a patient with discharge summary in multiple VistAs and in DoD
  Given a patient with pid "5000000217V519385" has been synced through Admin API
  When the client requests document for the patient "5000000217V519385" in VPR format
	Then the client receives 1 VPR VistA result(s)
    Then the client receives 10 VPR DoD result(s)

  And the VPR results contain "document"
    | field          | value                                                                                    |
    | uid            | urn:va:document:DOD:0000000001:3cc445968192d500d5a2ddbf23ab4952605f0b0c_20110502114150   |
    | facilityName   | DOD                                                                                      |
    | facilityCode   | DOD                                                                                      |
    | pid            | CONTAINS ;100716                                                                         |
    | kind           | Initial Evaluation Note                                                                  |
    | summary        | Pulmonary Nursing Follow-Up																|
 
# Discharge summary is equivalent to "Pulmonary Nursing Follow-Up"
# That's the discharge summary that comes from LOINC 28563-5
# we are using inpatient_notes for discharge summary
