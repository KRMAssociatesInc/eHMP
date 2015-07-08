@F159_Get_Days_Supply_Resource @OBE @future

Feature: F159 CPOE - Outpatient medications (ONC)
#resource to get days supply for outpatient med

@F159_Get_Days_Supply_Resource_1  @US3865 @TA12067 @OBE
Scenario: User renders days supply for dose 30MG for Forumlary drug Simvastatin for eighteen,patient
    When the client requests default days supply for param"{"patientIEN":"149","drugIEN":"1713","medIEN":"3500"}" and pid "10108V420871&_=1416907438077"
    Then a successful response is returned
    And the results contain
      | field       | value  |
      | dayssupply  | 30     |  

@F159_Get_Days_Supply_Resource_2 @US3865 @TA12067 @OBE
Scenario: User renders days supply for dose 15MCG for Forumlary drug Lantus for nine,inpatient
    When the client requests default days supply for param"{"patientIEN":"100717","drugIEN":"3053","medIEN":"4945"}" and pid "10108V420871&_=1418830020877"
    Then a successful response is returned
    And the results contain
      | field       | value   |
      | dayssupply  | 90      |
