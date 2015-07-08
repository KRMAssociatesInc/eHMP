@VitalsDoD_rest @debug @US977 @now
  Scenario: Client can request vitals
    Given a patient with "vitals" in multiple VistAs and in DoD
    When the client requests Vitals for the patient "10108"
    Then eHMP returns "42" DoD result(s)
    And eHMP returns "166" VistA result(s)
    And the results contain data group
      | field            | value                          |
      | summary          | TEMPERATURE 98.6 F             |
      | uid              | urn:va:vital:9E7A:3:12447      |
      | typeName         | TEMPERATURE                    |
      | result           | 98.6                           |
      | units            | F                              |
    And the results contain data group
      | field            | value                          |
      | summary          | BLOOD PRESSURE 120/86 mm[Hg]   |
      | uid              | urn:va:vital:9E7A:3:12450"     |
      | typeName         | BLOOD PRESSURE                 |
      | result           | 120/86                         |
      | units            | mm[Hg]                         |
    And the results contain data group
      | field            | value                          |
      | facilityCode     | DOD                            |
      | summary          | BLOOD PRESSURE 110/40 mmHg     |
      | uid              | urn:va:vital:DOD:0000000003:1000000582 |
      | typeName         | BLOOD PRESSURE                 |
      | result           | 110/40                         |
      | units            | mmHg                           |
    And the results contain data group
      | field            | value                          |
      | facilityCode     | DOD                            |
      | summary          | TEMPERATURE 98 F               |
      | uid              | urn:va:vital:DOD:0000000003:1000000586 |
      | typeName         | TEMPERATURE                    |
      | result           | 98                             |
      | units            | F                              |

@VitalsDoD_search @UI @debug @US977
  Scenario: User can search for vitals in the eHMP UI
  Given user has successfully logged into HMP
  And a patient with vitals in multiple VistAs and in DoD
  When user searches for "vital sign" for that patient
  Then search results displays "1" titles
  When user opens title "Vital Sign"
  Then search results include
    | summary_title          | summary_date      |
    | PULSE OXIMETRY Pass %  | 25-Nov-2013 09:49 |
    | PAIN Pass              | 25-Nov-2013 09:49 |
      