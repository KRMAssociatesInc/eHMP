@VistA_Import
Feature: F4 VistA Import
    Populate the LEIPR with all of the current VistA data from all available VistA hosts for a given patient when that patient's data is requested to be imported.
    
@future
Scenario: Data is requested for a patient known to the MVI and the MVI is available. 
    Given a patient that has not been synched that has Vitals data at multiple VistA hosts and that is known to the MVI
    When a request for Vitals is made
    Then the Vitals data is retrieved and stored in the LEIPR
    
@future
Scenario: Data is requested for a patient known to the MVI, but the MVI is unavailable. 
    Given a patient that has not been synched that has Vitals data at multiple VistA hosts and that is known to the MVI
    When a request for Vitals is made
    And the MVI is unavailable
    Then return the MVI status
    And requeue the request
    
@future
Scenario: Data is requested for a patient known to the MVI and the MVI is available, but a VistA host is unavailable. 
    Given a patient that has not been synched that has Vitals data at multiple VistA hosts and that is known to the MVI
    When a request for Vitals is made
    And a VistA host is unavailable
    Then return the status for that VistA host
    And requeue the request for that VistA host
    And the Vitals data is retrieved and stored in the LEIPR for the available VistA hosts
    
@US281
Scenario Outline: Support patient with data in multiple VistA hosts
    Given a patient with id "<patient_id>" has not been synced
    When a client requests "vital" for patient with id "<patient_id>"
    Then a successful response is returned within "60" seconds
    And the endpoint responds back
    And the response contains an element with BLOOD PRESSURE value of "<blood_pressure_value>"
  
  
  Examples:
  |patient_id   | blood_pressure_value         |
  |E2           | BLOOD PRESSURE 110/71 mm[Hg] |
  |E1           | BLOOD PRESSURE 120/80 mm[Hg] |
  |E101         | BLOOD PRESSURE 120/70 mm[Hg] |
  |E101         | BLOOD PRESSURE 120/75 mm[Hg] |

  #Patient Test Data:
  #E1 - Primary VistA instance
  #E2 - Secondary VistA instance
  #E101 - Primary and Secondary VistA instance