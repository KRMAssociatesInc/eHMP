@F114_SearchClinics
Feature: F144 - eHMP Viewer GUI - Patient Search (Clinics)

  Background:
      #Given a patient Search using Clinics

  @F114_SearchClinics_1 @vxsync @enrich
  Scenario: User clinics searches for patient using name and limited to "5"
    When the client requests for the patient name "10" starting with "0" and limited to "10" using clinics
    Then a successful response is returned
    And the client receives 10 VPR VistA result(s)
    And the client receives 58 RDK result(s) with start index of 0 and results limit of 10 per page
    And the VPR results contain
      | field       | value                                    |
      | localId     | 64                                       |
      | refId       | 64                                       |
      | name        | AUDIOLOGY                                |
      | shortName   | AUD                                      |
      | type        | C                                        |
      | typeName    | Clinic                                   |
      | facilityCode| 998                                      |
      | facilityName| ABILENE (CAA)                            |
      | displayName | Audiology                                |
      | uid         | urn:va:location:9E7A:64                  |
      | summary     | Location{uid='urn:va:location:9E7A:64'}  |
      | oos         | false                                    |

  @F114_SearchClinics_2
  Scenario: User clinics searches for patient with patient limited to 0
    When the client sends a request for the patient name "10" starting with "0" using clinics
    Then a successful response is returned
    #And the client receives 0 RDK result(s) with start index of 0
    And the client receives 58 VPR VistA result(s)

  @F114_SearchClinics_3
  Scenario: User clinics searches for patient with patient limited to 1 and should not contain uidHref
    When the client requests for the patient name "10" starting with "0" and limited to "1" using clinics
    Then a successful response is returned
    #And the client receives 1 RDK result(s) with start index of 0
    And the client receives 1 VPR VistA result(s)
    And the result(s) should not contain "uidHref"


    @F114_SearchClinics_4
    Scenario: User word searches for patient using name and facilityCode
    When the client requests for the patient name "10" and facilityCode "998" using clinics
    Then a successful response is returned
    And the client receives 0 VPR VistA result(s)

    @F114_SearchClinics_5
    Scenario: User word searches for patient using siteCode
    When the client requests for the siteCode "C877" using clinics
    Then a successful response is returned
    And the client receives 29 VPR VistA result(s)

    @F114_SearchClinics_6 @debug @vxsync @enrich
    Scenario: clinics searches for patient using locationUid ,filter and startDate
    When the client requests for the patient using locationUid "urn:va:location:9E7A:23" using filter "eq(familyName,"EIGHT")" and statdate "20010725"

    Then a successful response is returned
    And the client receives 1 VPR VistA result(s)
    And the VPR results contain
      | field       | value                            |
      | birthDate   | 19350407                         |
      | last4       | 0008                             |
      | last5       | E0008                            |
      | icn         | 10108V420871                     |
      | familyName  | EIGHT                            |
      | displayName | Eight,Patient                    |
      | fullName    | EIGHT,PATIENT                    |
      | genderCode  | urn:va:pat-gender:M              |
      | genderName  | Male                             |
      | sensitive   | false                            |
      | uid         | urn:va:pt-select:9E7A:3:3        |
      | summary     | Eight,Patient                    |
      |ssn          | *****0008                        |

    @F114_SearchClinics_7 @debug
    Scenario: clinics searches for patient using locationUid ,filter 
    When the client requests for the patient with locationUid "urn:va:location:9E7A:23" using filter "eq(familyName,"EIGHT")"
    Then a successful response is returned
   # And the client receives 1 VPR VistA result(s)


   @F114_SearchClinics_8 @debug
    Scenario: clinics searches for patient using locationUid ,filter , startDate and stopDate
    When  client requests for the patient using locationUid "urn:va:location:9E7A:23" using filter "eq(familyName,"EIGHT")" statdate "20010725" and stopdate"20100725"
    Then a successful response is returned
    And the client receives 1 VPR VistA result(s)

