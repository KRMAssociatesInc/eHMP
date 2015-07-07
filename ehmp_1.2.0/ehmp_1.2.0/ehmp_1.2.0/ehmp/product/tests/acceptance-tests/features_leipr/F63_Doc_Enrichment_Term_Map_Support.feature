@Term_Mapping
Feature: F63 Document Enrichment:Terminology Mapping Support 
Implement hooks that allow for data being imported from VistA to be mapped to other terminologies, dependent on terminology services being available.
       
Note: This is a good guess at what will happen. This scenario needs some work.


@future
Scenario: VUID for blood pressure is mapped to LOINC code for blood pressure when requesting Vitals data.
    Given a patient has not been synced
    And that patient has Vitals (blood pressure) data at a VistA instance
    When a client requests Vitals for that patient 
    Then a response is returned with Vitals data from the VistA instance for that patient
    And the VUID for the Vitals (blood presssure) is mapped to the LOINC code for Vitals (blood pressure)
    And the data is stored in the LEIPR using the LOINC code for Vitals (blood pressure)
    And the results can be viewed in JLV