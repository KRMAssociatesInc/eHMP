@f120_labsbyorder_rdk_api @vxsync @patient
Feature: F120 JLV GUI Refactoring to use VistA Exchange and request labsbyorder in VPR format from RDK API

@f120_labsbyorder_rdk_api @US1538 @11016V630869
Scenario: Client can request labsbyorder in VPR format from RDK API
    #Given a patient with pid "11016V630869" has been synced through the RDK API
    When the client requests lab orders for the patient "11016V630869" and order "urn:va:order:9E7A:227:16682" in VPR format from RDK API
    Then a successful response is returned
    And the client receives 7 VPR VistA result(s)
    And the VPR results contain
      | field              | value                                                |
      | typeName           | GLUCOSE                                              |
      #| vuid               | urn:va:vuid:4665449                                  |
      | typeCode           | urn:va:ien:60:175:72                                 |
      | result             | 310                                                  |
      | units              | mg/dL                                                |
      | interpretationCode | urn:hl7:observation-interpretation:HH                |
      | high               | 110                                                  |
      | units              | mg/dL                                                |
      | low                | 60                                                   |
      | units              | mg/dL                                                |
      | statusName         | completed                                            |
      | specimen           | SERUM                                                |
      | groupName          | CH 0317 234                                          |
      | groupUid           | urn:va:accession:9E7A:227:CH;6949681.966383          |
      | labOrderId         | 2790                                                 |
      | localId            | CH;6949681.966383;2                                  |
      | summary            | GLUCOSE (SERUM) 310<em>H*</em> mg/dL                 |
      | facilityCode       | 500                                                  |
      | comment            | CONTAINS Ordering Provider: Onehundredsixteen Vehu   |
      | facilityName       | CAMP MASTER                                          |
      | comment            | CONTAINS Performing Lab: ALBANY VA MEDICAL CENTER    |
      | comment            | CONTAINS VA MEDICAL CENTER 1 3RD sT.                 |
      | comment            | CONTAINS ALBANY                                      |
      | comment            | CONTAINS NY                                          |
      | comment            | CONTAINS 12180-0097                                  |
      | specimen           | SERUM                                                |
      | observed           | 200503170336                                         |
      | resulted           | 200503170336                                         |
      | uid                | urn:va:lab:9E7A:227:CH;6949681.966383;2              |
      | categoryCode       | urn:va:lab-category:CH                               |
      #| codes.code         | 2344-0                                               |
      #| codes.system       | http://loinc.org                                     |
      #| codes.display      | Glucose [Mass/volume] in Body fluid                  |
