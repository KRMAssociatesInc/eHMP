@F114_Cwad @vxsync @patient
Feature: F144 - eHMP Viewer GUI - Crisis Notes, Warnings, Allergies, Directives (CWAD)

@F114_1_Cwad @5000000341V359724
    Scenario: Display of CWAD Flags and Detail View
    When the client requests for the patient cwad "5000000341V359724" and filter value "ilike(kind,"%Allergy%")" using
    Then a successful response is returned
    And the client receives 40 result(s)
    And the VPR results contain
      | field         | value                            |
      |facilityCode   | 500 |
      |facilityName   | CAMP BEE |
      |entered        |200202131139|
      |verified       | 20020213113938|
      |kind           |  Allergy/Adverse Reaction|
      |originatorName |RADTECH,SEVENTEEN|
      |verifierName   |<auto-verified>|
      |mechanism      |ALLERGY|
      |uid            |urn:va:allergy:C877:100022:638|
      |summary        |STRAWBERRIES|
      |pid|C877;100022|
      |localId|638    |
      |historical     | true                   |
      |reference      |6;GMRD(120.82,          |
