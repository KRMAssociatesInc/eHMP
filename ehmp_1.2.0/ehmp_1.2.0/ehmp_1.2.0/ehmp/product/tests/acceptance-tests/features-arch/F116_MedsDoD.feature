@meds_rest_outpatient @debug
Scenario: Client can request outpatient meds
  Given a patient with "outpatient medications" in multiple VistAs and in DoD
  When the client requests Meds for the patient "9E7A;71"
  Then eHMP returns "44" result(s)
  And the results contain data group
    | field       | value                                             |
    | summary     | ATENOLOL 100MG TAB (EXPIRED)\n TAKE ONE EVERY DAY |
    | uid         | urn:va:med:9E7A:71:12007                          |
    | vaStatus    | EXPIRED                                           |
    | overallStop | 20010211                                          |
    | vaType      | O                                                 |
    | kind        | Medication, Outpatient                            |
  And the results contain data group
    | field       | value                                          |
    | summary     | ASPIRIN 600MG SUPP,RTL (EXPIRED)\n AS DIRECTED |
    | uid         | urn:va:med:9E7A:71:10976                       |
    | vaStatus    | EXPIRED                                        |
    | overallStop | 19991127                                       |
    | vaType      | O                                              |
    | kind        | Medication, Outpatient                         |
  And the results contain data group
    | field                   | value                                                            |
    | summary                 | ASPIRIN 325MG BUFFERED TAB (UNRELEASED)\n THREE TIMES A DAY      |
    | uid                     | urn:va:med:9E7A:71:8224                                          |
    | vaStatus                | UNRELEASED                                                       |
    | overallStop             | 19980726                                                         |
    | vaType                  | O                                                                |
    | kind                    | Medication, Outpatient                                           |

@meds_rest_inpatient @debug
  Scenario: Client can request inpatient meds
    Given a patient with "inpatient medications" in multiple VistAs and in DoD
    When the client requests Meds for the patient "9E7A;71"
    Then eHMP returns "44" result(s)
    And the results contain data group
      | field       | value                                                                                     |
      | summary     | IBUPROFEN, 800 MG, TABLET, ORAL (Expired)\n TAKE 1 TABLET 3 TIMES DAILY WITH FOOD #60 RF0 |
      | uid         | urn:va:med:DOD:0000000013:1000001027                                                      |
      | vaStatus    | Expired                                                                                   |
      | overallStop | 20130611                                                                                   |
      | vaType      | I                                                                                         |
      | kind        | Medication, Inpatient                                                                     |
    And the results contain data group
      | field       | value                                                                                    |
      | summary     | Acetaminophen 100mg/mL, Solution, Oral, 0.8mL (Discontinued)\n TAKE ONE PER DAY #1 RF0   |
      | uid         | urn:va:med:DOD:0000000013:1000001029                                                     |
      | vaStatus    | Discontinued                                                                             |
      | overallStop | 20130531                                                                                 |
      | vaType      | I                                                                                        |
      | kind        | Medication, Inpatient                                                                    |