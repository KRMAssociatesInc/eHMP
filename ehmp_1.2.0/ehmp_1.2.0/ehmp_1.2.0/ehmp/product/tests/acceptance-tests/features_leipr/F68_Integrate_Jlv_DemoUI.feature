@Integrate_JLV_UI
Feature: F68 Integrate JLV Demo UI
    The purpose of this feature is to take a Joint Legacy Viewer (JLV) product instance and utilize its user interface as a view-only demonstration tool for displaying VistA Exchange aggregated call results. 


@future
    Scenario: VistA Exchange supports display in JLV of Vitals data from two VistA instances for a patient
    Given a patient has not been synced
    And that patient has Vitals data at two VistA instances
    When a client requests Vitals for that patient 
    Then a response is returned with Vitals data from two VistA instances for that patient
    And the results can be viewed in JLV
    
@future
    Scenario: VistA Exchange supports display in JLV of Allergies data from two VistA instances for a patient
    Given a patient has not been synced
    And that patient has Allergies data at two VistA instances
    When a client requests Allergies for that patient 
    Then a response is returned with Allergies data from two VistA instances for that patient
    And the results can be viewed in JLV  
    
@future
    Scenario: VistA Exchange supports display in JLV of Lab (Chem/Hem) data from two VistA instances for a patient
    Given a patient has not been synced
    And that patient has Lab (Chem/Hem) data at two VistA instances
    When a client requests Lab (Chem/Hem) for that patient 
    Then a response is returned with Lab (Chem/Hem) data from two VistA instances for that patient
    And the results can be viewed in JLV    
