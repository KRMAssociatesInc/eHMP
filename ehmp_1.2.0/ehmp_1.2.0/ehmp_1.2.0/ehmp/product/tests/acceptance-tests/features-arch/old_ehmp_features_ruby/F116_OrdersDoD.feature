@Order @US1419 @single
Feature: F116 Return and display of orders records with VA and DoD data

Background:
  Given a patient with pid "5000000116V912836" has been synced through Admin API

@order
Scenario: Client can request order
  Given a patient with order in multiple VistAs and in DoD
  When the client requests order results for the patient "5000000116V912836" in VPR format
    Then the client receives 0 VPR VistA result(s)
    Then the client receives 24 VPR DoD result(s)
  And the VPR results contain "order"
    | field          | value                                                   |
    | uid            | urn:va:order:DOD:0000000002:1000010328                  |
    | facilityName   | DOD                                                     |
    | facilityCode   | DOD                                                     |
    | pid            | CONTAINS ;100615                                        |
    | kind           | Radiology                                               |
