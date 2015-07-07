@Immunization @US1421 @single
Feature: F116 Return and display of immunizations records with VA and DoD data


@immunization
Scenario: Client can request immunization
  Given a patient with immunization in multiple VistAs and in DoD
  Given a patient with pid "10108V420871" has been synced through Admin API
  When the client requests immunization for the patient "10108V420871" in VPR format
  Then the client receives 0 VPR VistA result(s)
  Then the client receives 21 VPR DoD result(s)
  And the VPR results contain "immunization"
    | field                | value                                                   |
    | uid                  | urn:va:immunization:DOD:0000000003:1000000652           |
    | facilityName         | DOD                                                     |
    | facilityCode         | DOD                                                     |
    | pid                  | CONTAINS 3                                              |
    | name                 | Tdap                                                    |
    | administeredDateTime | 20140113000000                                          |
    | kind                 | Immunization                                            |
