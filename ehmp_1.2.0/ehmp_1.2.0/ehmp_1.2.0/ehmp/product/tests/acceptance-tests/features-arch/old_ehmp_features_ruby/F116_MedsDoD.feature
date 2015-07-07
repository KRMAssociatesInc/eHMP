@medsDoD @single
Feature: F107 Return and display of and outpatient medications with DoD data

Background:
  Given a patient with pid "9E7A;71" has been synced through Admin API

@meds_outpatient
Scenario: Client can request outpatient meds
  Given a patient with "outpatient medications" in multiple VistAs and in DoD
  When the client requests medications for the patient "9E7A;71" in VPR format
    Then VPR return 46 VistA result(s)
    And the VPR results contain "med"
    | field       | value                                             |
    | summary     | ATENOLOL 100MG TAB (EXPIRED)\n TAKE ONE EVERY DAY |
    | uid         | urn:va:med:9E7A:71:12007                          |
    | vaStatus    | EXPIRED                                           |
    | overallStop | 20010211                                          |
    | name        | ATENOLOL TAB                                |
    | vaType      | O                                                 |
    | kind        | Medication, Outpatient                            |
    
@meds_inpatient
  Scenario: Client can request inpatient meds
    Given a patient with "inpatient medications" in multiple VistAs and in DoD
    When the client requests medications for the patient "9E7A;71" in VPR format
    Then VPR return 46 VistA result(s)
    And the VPR results contain "med"
      | field       | value                                                                                     |
      | summary     | IBUPROFEN, 800 MG, TABLET, ORAL (Expired)\n TAKE 1 TABLET 3 TIMES DAILY WITH FOOD #60 RF0 |
      | uid         | urn:va:med:DOD:0000000013:1000011027                                                      |
      | vaStatus    | Expired                                                                                   |
      | overallStop | 20130611210500                                                                            |
      | name        | IBUPROFEN, 800 MG, TABLET, ORAL                                                           |
      | vaType      | I                                                                                         |
      | kind        | Medication, Inpatient                                                                     |
