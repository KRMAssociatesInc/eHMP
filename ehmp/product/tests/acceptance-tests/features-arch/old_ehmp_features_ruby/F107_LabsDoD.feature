@labsDoD @debug @single
Feature: F107 Return and display of labs with VA and DoD data

#This feature item returns DoD Lab (Chem/Hem) results in VPR format.

Background:
    Given a patient with pid "10110V004877" has been synced through Admin API

  @labs
  Scenario: Client can request DoD Lab (Chem/Hem) results in VPR format
    Given a patient with "labs" in multiple VistAs and in DoD
    When the client requests labs for the patient "10110V004877" in VPR format
    Then the client receives 598 VPR VistA result(s)
    Then the client receives 16 VPR DoD result(s)
      And the VPR results contain "lab"
      | field    | value                                      |
      | summary  | Ammonia, Plasma Quantitative (PLASMA) 5<em>L</em> mcg/dL   |
      | uid      | urn:va:lab:DOD:0000000008:20070621102500_070621-LC-326-CH_44829 |
      | result   | 5                                          |
      | low      | 19                                         |
      | high     | 60                                         |
      | units    | mcg/dL                                     |
      | specimen | PLASMA                                     |
