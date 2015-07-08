@notes_rest
  Scenario: Client can request notes
    Given a patient with "DoD clinical notes" in multiple VistAs and in DoD
    When the client requests unfiltered documents for the patient "10108"
    Then eHMP returns "55" result(s)
    And the results contain data group
      | field            | value                                                         |
      | summary          | Procedure Note (Provider) Document                            |
      | uid              | urn:va:document:DOD:0000000003:1000000648                     |
      | kind             | Procedure Note (Provider) Document                            |
      | author           | BHIE, USERONE                                                 |
      | dodComplexNoteUri| https://10.3.3.4:8443/documents/dod/0000000003/1000000648.html|
      | facilityCode     | DOD                                                           |
      | facilityName     | DOD                                                           |
      | dateTime         | 20140619031308                                                |
      | documentTypeName | Procedure Note (Provider) Document                            |
      | localTitle       | Procedure Note (Provider) Document                            |
      | status           | completed                                                     |
      | statusName       | completed                                                     |
    And the results contain data group
      | field            | value                                                         |
      | summary          | Progress Note                                                 |
      | uid              | urn:va:document:DOD:0000000003:1000000655                     |
      | kind             | Progress Note                                                 |
      | dodComplexNoteUri| https://10.3.3.4:8443/documents/dod/0000000003/1000000655.html|
      | facilityCode     | DOD                                                           |
      | facilityName     | DOD                                                           |
      | dateTime         | 20131009045427                                                |
      | documentTypeName | Progress Note                                                 |
      | localTitle       | Progress Note                                                 |
      | status           | completed                                                     |
      | statusName       | completed                                                     |