@procedures_rest
Scenario: Client can request radiology procedures
  Given a patient with radiology procedures in multiple VistAs and DoD
  When the client requests radiology procedures for the patient "10110"
#Then eHMP returns all procedures in the results
  Then eHMP returns "2" result(s)
  And the results contain data group
    | field          | value                                  |
    | name           | WRIST,RT                               |
    | uid            | urn:va:image:DOD:0000000008:1000001513 |
    | facilityName   | DOD                                    |
    | facilityCode   | DOD                                    |
    | dateTime       | 20070621                               |
    | statusName     | TRANSCRIBED                            |
    | localId        | 07000074                               |
    | pid            | 10110                                  |
    | kind           | Radiology                              |
    | Category       | RA                                     |
  And the results contain data group
    | field          | value                                  |
    | name           | CHEST,AP                               |
    | uid            | urn:va:image:DOD:0000000008:1000001515 |
    | facilityName   | DOD                                    |
    | facilityCode   | DOD                                    |
    | dateTime       | 20070621                               |
    | statusName     | TRANSCRIBED                            |
    | localId        | 07000073                               |
    | pid            | 10110                                  |
    | kind           | Radiology                              |
    | Category       | RA                                     |