@F114_SearchWard
Feature: F144 - eHMP Viewer GUI - Patient Search (Ward)

  Background:
      #Given a search for patient with range
      
  @F114_SearchWard_1 @vxsync @enrich
  Scenario: User word searches for patient using name and limited to 5
    When the client requests for the patient name "3" starting with "0" and limited to "5" using Word
    Then a successful response is returned
    And the client receives 5 VPR VistA result(s)
    And the client receives 24 RDK result(s) with start index of 0 and results limit of 5 per page
    And the RDK last5 search results contain
      | field       | value                                    |
      | localId     | 5                                        |
      | refId       | 5                                        |
      | name        | 3 NORTH SURG                             |
      | shortName   | 3N SR                                    |
      | type        | W                                        |
      | typeName    | Ward                                     |
      | facilityCode| 998                                      |
      | facilityName| ABILENE (CAA)                            |
      | displayName | 3 North Surg                            |
      | uid         | urn:va:location:C877:5                   |
      | summary     | Location{uid='urn:va:location:C877:5'}   |
      | oos         | false                                    |

  @F114_SearchWard_2
  Scenario: User word searches for patient with patient limited to 0
    When the client sends a request for the patient name "7A" starting with "0" using Word
    Then a successful response is returned
    #And the client receives 0 RDK result(s) with start index of 0
    And the client receives 24 VPR VistA result(s)

  @F114_SearchWard_3
  Scenario: User word searches for patient with patient limited to 1 and should not contain uidHref
    When the client requests for the patient name "3" starting with "0" and limited to "1" using Word
    Then a successful response is returned
    #And the client receives 1 RDK result(s) with start index of 0
    And the client receives 1 VPR VistA result(s)
    And the result(s) should not contain "uidHref"

    @F114_SearchWard_4
    Scenario: User word searches for patient using name and facilityCode
    When the client requests for the patient name "3" and facilityCode "998"
    Then a successful response is returned
    And the client receives 4 VPR VistA result(s)

    @F114_SearchWard_5
    Scenario: User word searches for patient using siteCode
    When the client requests for the siteCode "C877"
    Then a successful response is returned
    And the client receives 12 VPR VistA result(s)

    @F114_SearchWard_6 @vxsync @enrich
    Scenario: Word searches for patient using refId ,locationUid ,filter 
    When the client requests for the patient reid "38" with locationUid "urn:va:location:9E7A:158" using filter "eq(familyName,"EIGHT")" Word searches
    Then a successful response is returned
    And the client receives 1 VPR VistA result(s)
    And the VPR results contain
      | field       | value                            |
      | birthDate   | 19350407                         |
      | last4       | 0008                             |
      | last5       | E0008                            |
      | icn         | 10108V420871                |
      | familyName  | EIGHT                            |
      | displayName | Eight,Patient                 |
      | fullName    | EIGHT,PATIENT                    |
      | genderCode  | urn:va:pat-gender:M              |
      | genderName  | Male                             |
      | sensitive   | false                            |
      | uid         | urn:va:pt-select:9E7A:3:3     |
      | summary     | Eight,Patient                   |
      |ssn          | *****0008                       |

    @F114_SearchWard_7 @vxsync @enrich
    Scenario: Word searches for patient using refId ,locationUid ,filter and making sure roomBed is in VPR results
    When the client requests for the patient reid "8" with locationUid "urn:va:location:9E7A:8" using filter "eq(familyName,"EIGHTY")" Word searches
    Then a successful response is returned
    And the client receives 1 VPR VistA result(s)
    And the VPR results contain
      | field       | value                            |
      | birthDate   | 19450309                         |
      | last4       | 0880                            |
      | last5       | E0880                            |
      | icn         | 5000000289V616346               |
      | familyName  | EIGHTY                            |
      | displayName | Eighty,Inpatient                |
      | fullName    | EIGHTY,INPATIENT                    |
      | genderCode  | urn:va:pat-gender:M              |
      | genderName  | Male                             |
      | sensitive   | false                            |
      | uid         | urn:va:pt-select:9E7A:100788:100788    |
      | summary     | Eighty,Inpatient                  |
      |ssn          |  *****0880                       |
      | localId     | 100788                           |
      |roomBed       | ICU-5                       |
