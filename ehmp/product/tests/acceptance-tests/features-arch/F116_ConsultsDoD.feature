@consults_rest
  Scenario: Client can request consults
    Given a patient with "consult notes" in multiple VistAs and in DoD
    When the client requests unfiltered documents for the patient "10108"
    Then eHMP returns "55" result(s)
    And the results contain data group
      | field            | value                                                          |
      | summary          | Consultation Note (Provider) Document                          |
      | uid              | urn:va:document:DOD:0000000003:1000000649                      |
      | kind             | Consultation Note (Provider) Document                          |
      | dodComplexNoteUri| https://10.3.3.4:8443/documents/dod/0000000003/:1000000649.html|
      | facilityCode     | DOD                                                            |
      | facilityName     | DOD                                                            |
      | dateTime         | 20140110051524                                                 |
      | documentTypeName | Consultation Note (Provider) Document                          |
      | localTitle       | Consultation Note (Provider) Document                          |
      | status           | completed                                                      |
      | statusName       | completed                                                      |
    And the results contain data group
      | field            | value                                                         |
      | summary          | AUDIOLOGY - HEARING LOSS CONSULT                              |
      | uid              | urn:va:document:9E7A:3:3112                                   |
      | kind             | Consult Report                                                |
      | facilityCode     | 500                                                           |
      | facilityName     | CAMP MASTER                                                   |
      | dateTime         | 200404012257                                                  |
      | documentTypeName | Consult Report                                                |
      | localTitle       | AUDIOLOGY - HEARING LOSS CONSULT                              |
      | status           | completed                                                     |
      | statusName       | completed                                                     |