#@F140_AllPatientSearch
Feature: F140 – All Patient Search

#This feature will allow a user to search for patients globally in eHMP through a global patient search feature MVI.Once the search criteria is entered, a maximum of 10 results will be shown. If there are more than 10 results, than no results will be returned.  This also searches for sensitive patient.

# Team Andromeda

#@f140_1_lastNameSSNSearch @US1977 @smoke
Scenario: search with last name and ssn
    When user selects all patient tab
    And  user searches for last_name "Eight" and ssn "666000008"
    And  user selects "EIGHT,PATIENT" 
    And  user confirms selection 
    And  patient search screen displays the "This patient likes to wander around the hospital. Please notify the security office" message 
    And  user confirms flagged messages
    Then "Eight,Patient" information is displayed in overview
        | field         | value       |
        | dob           | 04/07/1935  |
        | age           | 79y         |
        | gender        | Male        |
        | ssn           | 666-00-0008 |

#@f140_2_firstLastNameSearch @US1977 @reglite
Scenario: search with first name and last name
    When user selects all patient tab
    And user searches for last_name "Eight" and first_name "patient"
    And user selects "EIGHT,PATIENT"
    Then "EIGHT,PATIENT" information is displayed
        | field         | value       |
        | dob           | 04/07/1935  |
        | age           | 79y         |
        | gender        | Male        |
        | ssn           | 666-00-0008 |

#@f140_3_lastNameDOBSearch @US1977
Scenario: search with last name and date of birth
    When user selects all patient tab
    And user searches for last_name "Eight" and dob "04/07/1935"
    And user selects "EIGHT,PATIENT"
    Then "EIGHT,PATIENT" information is displayed
        | field         | value       |
        | dob           | 04/07/1935  |
        | age           | 79y         |
        | gender        | Male        |
        | ssn           | 666-00-0008 |

#@f140_4_firstLastNameDOBSearch @US1977 @reglite
#Scenario: search with first name, last name and date of birth
 #   When user selects all patient tab
#    When user searches for first_name "Eight", ssn "666-00-0008" and dob "04/07/1935"     
 #   Then patient search screen displays search button is not enabled

#@f140_6_ssnSearchError @US1977
Scenario: search with incomplete SSN and get an error msg
   When user selects all patient tab
   And user searches for last_name "eight", ssn "0008"    
   Then patient search screen displays "SSN must match the format: 123-45-6789 or 123456789"

@f140_7_searchCountError @US1977
Scenario: search count is more than 10 results, so no results will be returned.
    When user selects all patient tab
    And  user searches for last_name "Smith" and first_name "John"
    Then patient search screen displays "Search returned too many results please refine your search criteria and try again."

@f140_8_searchNoResultError @US1977
Scenario: search count is 0 results and get an error msg.
    When user selects all patient tab
    And  user searches for last_name "Unknown" and first_name "Patient"
    Then patient search screen displays "No results were found."

@f140_9_sensitivePatientSearch @US2438
Scenario: user searches and selects sensitive patient
    When user selects all patient tab
    And  user searches for last_name "zzzretfivefifty" and first_name "Patient"
    And  user selects "zzzretfivefifty"
    And  it displays "RESTRICTED RECORD" on acknowledgement confirm section
    And  user acknowledges message
    And  user confirms selection
    Then "Zzzretfivefifty,Patient" information is displayed in overview
      | field       | value         |
      | DOB         | 04/07/1935    |
      | Age         | 79y           |
      | Gender      | Male          |
      | SSN         | 666-21-2121   |

#@f140_10_KodakOnlyPatient_1 @DE271 @debug
Scenario: Looging in as Panorama user, shall be able to search for Kodak patients under the All Patient search 
    When user selects all patient tab
    And user searches for last_name "Bcma" and first_name "Eighteen-Patient"  
    And user selects "Bcma,Eighteen-Patient"
    And user confirms selection
    Then "Bcma,Eighteen-Patient" information is displayed in overview
      | field         | value         |
      | dob           | 04/07/1935    |
      | age           | 79y           |
      | gender        | Male          |
      | ssn           | 666-33-0018   |

#@f140_11_PatientNotInAnyVistaSearch @DE271
Scenario: All Patient search with first name and full last name that is not in Kodak or Panorama (JDS)
    When user selects all patient tab
    And user searches for last_name "DODONLY" and first_name "PATIENT"  
    And user selects "DODONLY,PATIENT"
    And user confirms selection
    Then patient search screen displays "This patient's record is not yet accessible. Please contact your HIMS representative and have the patient loaded into your local VistA."

#@f140_13_firstLastNameSearch @DE220
Scenario: search with first name and full last name with white spaces in beginning and end
    When user selects all patient tab
    And  user searches for last_name " Eight  " and first_name " Patient  "
    And  user selects "EIGHT,PATIENT"
    And  user confirms selection
    And  user confirms flagged messages
    Then "Eight,Patient" information is displayed in overview
    | field         | value       |
    | dob           | 04/07/1935  |
    | age           | 79y         |
    | gender        | Male        |
    | ssn           | 666-00-0008 |
