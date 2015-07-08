@F159_Get_Quantity_Resource @OBE @future

Feature: F159 CPOE - Outpatient medications (ONC)
#resource to get default quantity for outpatient med

@F159_Get_Quantity_Resource_1  @US3866 @TA12072 @OBE
Scenario: User renders quantity for dose 5MG with default schedule QPM for Forumlary drug Simvastatin for eighteen,patient 
    When the client requests default quantity for param"{"supply":"30", "dose":"1", "schedule":"QPM", "duration":"~", "patientIEN": "149", "drugIEN":"1715"}" and pid "10108V420871&_=1416907438077"
    Then a successful response is returned
    And the results contain
      | field     | value  |
      | quantity  | 30     |  

@F159_Get_Quantity_Resource_2  @US3866 @TA12072 @OBE
Scenario: User renders quantity for dose 30MG with default schedule QPM for Forumlary drug Simvastatin for eighteen,patient 
    When the client requests default quantity for param"{"supply":"30", "dose":"1.5", "schedule":"QPM", "duration":"~", "patientIEN": "149", "drugIEN":"1713"}" and pid "10108V420871&_=1416907438077"
    Then a successful response is returned
    And the results contain
      | field     | value  |
      | quantity  | 45     |  

@F159_Get_Quantity_Resource_3  @US3866 @TA12072 @OBE
Scenario: User renders quantity for dose 160MG with default schedule QPM for Forumlary drug Simvastatin for eighteen,patient 
    When the client requests default quantity for param"{"supply":"30", "dose":"2", "schedule":"QPM", "duration":"~", "patientIEN": "149", "drugIEN":"1728"}" and pid "10108V420871&_=1416907438077"
    Then a successful response is returned
    And the results contain
      | field     | value  |
      | quantity  | 60     |  

@F159_Get_Quantity_Resource_4  @US3866 @TA12072 @OBE
Scenario: User renders quantity for dose 5MG with default schedule QM for Forumlary drug Simvastatin for eighteen,patient 
    When the client requests default quantity for param"{"supply":"30", "dose":"1", "schedule":"QM", "duration":"~", "patientIEN": "149", "drugIEN":"1715"}" and pid "10108V420871&_=1416907438077"
    Then a successful response is returned
    And the results contain
      | field     | value  |
      | quantity  | 90     |  

@F159_Get_Quantity_Resource_5  @US3866 @TA12072 @OBE
Scenario: User renders quantity for dose 30MG with default schedule QM for Forumlary drug Simvastatin for eighteen,patient 
    When the client requests default quantity for param"{"supply":"30", "dose":"1.5", "schedule":"QM", "duration":"~", "patientIEN": "149", "drugIEN":"1713"}" and pid "10108V420871&_=1416907438077"
    Then a successful response is returned
    And the results contain
      | field     | value  |
      | quantity  | 135    |  

@F159_Get_Quantity_Resource_6  @US3866 @TA12072 @OBE
Scenario: User renders quantity for dose 30MG with default schedule QID for Forumlary drug Simvastatin for eighteen,patient 
    When the client requests default quantity for param"{"supply":"30", "dose":"1.5", "schedule":"QID", "duration":"~", "patientIEN": "149", "drugIEN":"1713"}" and pid "10108V420871&_=1416907438077"
    Then a successful response is returned
    And the results contain
      | field     | value  |
      | quantity  | 180    |  