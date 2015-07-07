@F140_AllPatientSearch
Feature: F140 – All Patient Search

#This feature will allow a user to search for patients globally in eHMP through a global patient search feature MVI.Once the search criteria is entered, a maximum of 10 results will be shown. If there are more than 10 results, than no results will be returned.  This also searches for sensitive patient.

# Team Andromeda

Background:
    Given I have a browser available
    And   I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
    Then  I can see the landing page
    And   user selects all patient tab

@f140_1_lastNameSSNSearch @US1977 @smoke
Scenario: search with last name and ssn
    When  user searches for "last_name" and "ssn"
        | field         | value       |
        | last_name     | Eight       |
        | ssn           | 666-00-0008 |
    And   user selects all patient result with patient name "EIGHT,PATIENT"
    And   user confirms selection 
    Then "patient identifying traits" is properly displayed 
        | field         | value       |
        | dob           | 04/07/1935  |
        | age           | 79y         |
        | gender        | Male        |
        | ssn           | 666-00-0008 |

@f140_2_firstLastNameSearch @US1977 @reglite
Scenario: search with first name and last name
    When  user searches for "last_name" and "first_name"
        | field         | value       |
        | last_name     | Eight       |
        | first_name    | patient     |
    And   user selects all patient result with patient name "EIGHT,PATIENT"
    And   user confirms selection 
    Then "patient identifying traits" is properly displayed 
        | field         | value       |
        | dob           | 04/07/1935  |
        | age           | 79y         |
        | gender        | Male        |
        | ssn           | 666-00-0008 |

@f140_3_lastNameDOBSearch @US1977
Scenario: search with last name and date of birth
    When  user searches for "last_name" and "dob"
        | field         | value       |
        | last_name     | Eight       |
        | dob           | 04/07/1935  |
    And   user selects all patient result with patient name "EIGHT,PATIENT"
    And   user confirms selection 
    Then "patient identifying traits" is properly displayed 
        | field         | value        |
        | dob           | 04/07/1935   |
        | age           | 79y          |
        | gender        | Male         |
        | ssn           | 666-00-0008  |

@f140_4_firstLastNameDOBSearch @US1977 @reglite
Scenario: search with first name, last name and date of birth
    When  user searches for "first_name", "ssn" and "dob"
        | field         | value       |
        | first_name    | patient     |
        | ssn           | 666-00-0008 |
        | dob           | 04/07/1935  |  
    Then user is unable to perform the search

@f140_6_ssnSearchError @US1977
Scenario: search with incomplete SSN and get an error msg
    When  user searches for "last_name", "ssn" 
        | field         | value       |
        | last_name     | eight       |
        | ssn           | 0008        |
       
    Then patient search screen displays "Error: SSN must match the format: 123-45-6789 or 123456789"

@f140_7_searchCountError @US1977
Scenario: search count is more than 10 results, so no results will be returned.
    When  user searches for "last_name", "first_name" 
        | field         | value       |
        | last_name     | Smith       |
        | first_name    | John        |

    Then patient search screen displays "Search returned too many results please refine your search criteria and try again."
   
@f140_8_searchNoResultError @US1977
Scenario: search count is 0 results and get an error msg.
    When  user searches for "last_name", "first_name" 
        | field         | value       |
        | last_name     | Unknown     |
        | first_name    | Patient     |

    Then patient search screen displays "No results were found." 

@f140_9_sensitivePatientSearch @US2438
Scenario: user searches and selects sensitive patient
    When  user searches for "last_name", "first_name" 
        | field         | value              |
        | last_name     | zzzretfivefifty    |
        | first_name    | Patient            |
    And   user selects all patient result with patient name "ZZZRETFIVEFIFTY,PATIENT"
    And  all patient "acknowledgement message" is displayed on acknowledgement confirm section
    And  user acknowledges message      
    And  user confirms selection 
    Then "patient identifying traits" is properly displayed 
        | field         | value                      |
        | dob           | 04/07/1935                 |
        | age           | 79y                        |
        | gender        | Male                       |
        | ssn           | 666-21-2121                | 

@f140_10_KodakOnlyPatient_1 @DE271 @debug
Scenario: All Patient search with first name and full last name that is in Kodak only and is not in Panorama. User logs on as panorama
    When  user searches for "last_name", "first_name" 
        | field         | value              |
        | last_name     | Bcma               |
        | first_name    | Eighteen-Patient   |
    And   user selects all patient result with patient name "Bcma,Eighteen-Patient"
    And   user confirms selection 
    Then "patient identifying traits" is properly displayed 
        | field         | value         |
        | dob           | 04/07/1935    |
        | age           | 79y           |
        | gender        | Male          |
        | ssn           | 666-33-0018   |
   
@f140_11_PatientNotInAnyVistaSearch @DE271
Scenario: All Patient search with first name and full last name that is not in Kodak or Panorama (JDS)
    When  user searches for "last_name", "first_name" 
        | field         | value              |
        | last_name     | Dodonly            |
        | first_name    | Patient            |
    And   user selects all patient result with patient name "DODONLY,PATIENT"
    And   user click on Confirm Selection
    Then  patient search screen displays "This patient's record is not yet accessible. Please contact your HIMS representative and have the patient loaded into your local VistA."

@f140_13_firstLastNameSearch @DE220
Scenario: search with first name and full last name with white spaces in beginning and end
    When  user searches for "last_name", "first_name" 
        | field         | value              |
        | last_name     | ' Eight  '         |
        | first_name    | ' Patient  '       |

    And   user selects all patient result with patient name "EIGHT,PATIENT"
    And   user confirms selection 
    Then "patient identifying traits" is properly displayed 
        | field         | value       |
        | dob           | 04/07/1935  |
        | age           | 79y         |
        | gender        | Male        |
        | ssn           | 666-00-0008 |

# Below code is temporary (for reference)
    #And the user selects on All Patient Search
   # Then the user select all patient result patient name "EIGHT,PATIENT"
    #And the all patient "patient identifying name" is displayed on confirm section header
     #   | field                     | value                      |
      #  | patient identifying name  | EIGHT,PATIENT              |
    #And the all patient "patient identifying traits" is displayed on confirm section
      #  | field         | value                      |
       # | dob           | 04/07/1935                 |
      #  | age           | 79y                        |
      #  | gender        | Male                       |
      #  | ssn           | 666-00-0008                |
    #When the user click on Confirm Selection
    #Then Overview is active
    #And the "patient identifying traits" is displayed with information
     #   | field         | value                      |
      #  | patient name  | Eight,Patient              |
        