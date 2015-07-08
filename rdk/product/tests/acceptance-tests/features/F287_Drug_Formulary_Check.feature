@F287_Drug_Formulary_Check_Resource @OBE @future

Feature: F287 Drug Formulary Check (ONC)
# User renders all and correct out-patient list from Forumlary writeback 

@F287_Drug_Formulary_Check_Resource_1  @US3197 @OBE
Scenario: User renders all and correct out-patient list from Forumlary for Simvastatin
    When the client requests for the patient param"{"count":"5","search":"Simvastatin"}" and pid "10108V420871&_=1416907438074"
    Then a successful response is returned
    And the VPR results contain
      | field       | value                                      |
      |  IEN        | 3500                                       |
      | name        |CONTAINS SIMVASTATIN TAB                    |
      | desc        |                |
      | formulary   |   true                                     |

@F287_Drug_Formulary_Check_Resource_2  @US3197 @OBE
Scenario: User renders all and correct out-patient list from Forumlary for Lorazepam
    When the client requests for the patient param"{"count":"5","search":"Lorazepam"}" and pid "10108V420871&_=1416907438074"
    Then a successful response is returned
    And the VPR results contain
      | field       | value                                      |
      |  IEN        | 1725                                       |
      | name        |CONTAINS LORAZEPAM INJ                      |
      | desc        |               |
      | formulary   |   true                                     |


@F287_Drug_Formulary_Check_Resource_3  @US3197 @OBE
Scenario: User renders all and correct out-patient list from Forumlary for Lantus
    When the client requests for the patient param"{"count":"5","search":"Lantus"}" and pid "10108V420871&_=1416907438074"
    Then a successful response is returned
    And the VPR results contain
      | field       | value                                      |
      |  IEN        | 4945                                       |
      | name        | LANTUS                                  |
      | desc        |<PRAMLINTIDE PEN INJ,SOLN >               |
      | formulary   |   true                                     |









