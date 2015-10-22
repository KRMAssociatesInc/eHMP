# Team Mercury
@F144 @US3584 @regression
Feature: F144-eHMP Viewer GUI - Crisis Notes, Warnings, Allergies, Directives (CWAD)
The user should be able look at CWAD flags in patient header and user looks for patient-status-icon

Background:
    Given user is logged into eHMP-UI
    When user searches for and selects "Eight,Patient"
    Then Overview is active
 

@US3584_4_cwad @DE979
Scenario: The user can identify when a patient has postings (secondary test)
  Given the following postings are active
    | Posting      |
    | Crisis Notes |
    | Allergies    |
    | Directives    |
    | Patient Flags |
  And the following postings are inactive
    | Posting       |
    | Warnings      |    
    


@SyncStatus_1 @DE1252
Scenario: The user looks for patient-status-icon
    Then the region "Bottom Region" is displayed
    And "Bottom Region" contains "eHMP version"
    Then the user looks for patientstatus icon site,All VA ,DOD and Externals
     | field	   |
	   | My Site   |
		 | All VA    |
	   | DoD       |
	   | Communities |

  
