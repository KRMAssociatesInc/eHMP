@RadiologyDoD @single
Feature: F107 Return and display of radiology procedures with VA and DoD data


@radiology
Scenario: Client can request Radiology Reports
  Given a patient with radiology procedures in multiple VistAs and DoD
  Given a patient with pid "10110V004877" has been synced through Admin API
  When the client requests radiology report results for the patient "10110V004877" in VPR format
    Then the client receives 30 VPR VistA result(s)
    Then the client receives 2 VPR DoD result(s)
    And the VPR results contain "radiology"
    | field          | value                                  |
    | name           | WRIST,RT                               |
    | uid            | urn:va:image:DOD:0000000008:1000001513 |
    | facilityName   | DOD                                    |
    | facilityCode   | DOD                                    |
    | dateTime       | 20070621103400                         |
    | statusName     | TRANSCRIBED                            |
    | localId        | 07000074                               |
    | pid            | CONTAINS DOD;                          |
    | kind           | Radiology                              |
    | category       | RA                                     |
 