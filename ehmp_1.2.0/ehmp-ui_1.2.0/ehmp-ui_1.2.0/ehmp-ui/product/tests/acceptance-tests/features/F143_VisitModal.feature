
@US1979 @onc 
Feature: F143 - Establish Visit Context (Write-back)

#The eHMP Visit context capability will allow a user to create or select an visit to which almost all other clinical activities can be associated. 
# A visit must be selected before performing an action requiring a visit context.

#POC: Team Orion
Background:
    Given user is logged into eHMP-UI
    And user searches for and selects "Eight,Patient"
    Then Cover Sheet is active

@US1979_Modal_Details 
Scenario: Viewing the  Visit modal details.
    And user views screen "visit-select" in the eHMP-UI
    When the user clicks button "Select Visit"
    Then the modal title is "Location for Current Activity"
    Then the visit context  modal contains headers
        |Headers|
        |New Visit|
        |Hospital Admissions|
        |Clinic Appointments|  
    
    And the modal contains buttons "Cancel" and "Confirm"
    And the Clinic Appointments contain rows

    |headers    |       Field   |
  #|Comp And Pen|  1994-06-16 14:15|
  |General Medicine|  05/21/2000 09:00 |
  |General Medicine|  05/22/2000 09:00 |
  |General Medicine|  05/23/2000 09:00 |
  |General Medicine|  05/24/2000 09:00 |
  |General Medicine|  05/25/2000 09:00 |
  |Audiology       |   05/25/2000 11:30|
  |General Medicine|  05/25/2001 09:30 |
  |General Medicine|  04/29/2002 09:45 |

  And Hospital admissions contain rows
  
   |Headers    |       Field   |
  #|Gen Med        |1994-11-30 12:00|
  |7A Gen Med      |   03/25/2004 08:30|
  |Inactive(2 Nhcu)| 07/16/1993 13:00 |
  |Gen Med        | 11/30/1994 12:00 |
  |7A Gen Med      | 03/25/2004 08:30 |
  |Inactive(2 Nhcu)| 07/16/1993 13:00 |

@US2215_NewVisitTab 
Scenario:Testing functionality of New Visit tab
  And the user clicks on "Visit Information" tab 
  Then the modal title is "Location for Current Activity"
  And the user clicks on "New Visit" tab 
  #And the user clicks on "Visit Location" text box
  Then user type search text term and the page contains total items and search results

      | text           | total_items |
      | DIA            | 4           |
      | ANG            | 2           |
      | GEN            | 2           |
      | CAR            | 1           |
      | LAB            | 2           |

    When the user selects "DIABETIC" from the results
    Then "DIABETIC" should be populated in Encounter Location field
    And the New Visit tab contains text "A visit that occurred at some time in the past or at some other location (possibly non-VA) but is not used for workload credit." 
    Then DateTime of Visit should display today's Date and current Time
    

@US2903_NewVisitTab_DefaultProvider 
Scenario: Testing default Provider in the Visit context modal
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  And user views screen "visit-select" in the eHMP-UI
  When the user clicks button "Select Visit"
  And the user clicks on "New Visit" tab 
  Then if user is provider then it displays in Encounter Provider field

@US2903_NewVisitTab_DefaultNonProvider 
Scenario: Testing default Provider in the Visit context modal with different user

  Given user is logged into eHMP-UI with non-provider user
  And user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  And user views screen "visit-select" in the eHMP-UI
  When the user clicks button "Select Visit"
  And the user clicks on "New Visit" tab 
  Then if user is provider then it does not display in Encounter Provider field
      
      



  