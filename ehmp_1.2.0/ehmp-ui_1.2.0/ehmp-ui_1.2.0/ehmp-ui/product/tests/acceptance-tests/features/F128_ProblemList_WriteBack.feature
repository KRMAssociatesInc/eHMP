#Team Orion
#future put on until test is updated to not use Eight,Patient
@F128 @onc @future 
Feature: F128 - Problem List (write-back)
#Add, Edit and Remove primary VistA entries on the patient problem list applet

Background:
Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,PATIENT"
  And Cover Sheet is active
  And the add-edit user clicks on Visit Information box in header
  And the modal title "Location for Current Activity" appears
  And the user clicks on "Clinic Appointments" tab
  #And the user selects "General Medicine" dated "04/15/1997" for encounter
  And the user selects first row "General Medicine" 
  And the modal contains buttons "Cancel" and "Confirm"
  And the user clicks button "Confirm"
  And Visit Information in header reflects the selected visit
  And the user clicks on the expand view of Problem Applet

@DE438 @US1893 @US2902 @US2931 @DE638 @debug
Scenario: Adding a new problem
When add-edit user clicks on "Add_Item"
  And user enters search term "headache1234" 
  And user clicks "Use Entered Term" button
  And the problem modal header contains the problem
  And the problem modal contains three buttons "Back", "Cancel" and "Add Active Problem"
  And modal contains two buttons "Active" and "Inactive" for problem Status
  And modal contains three buttons "Unknown" "Acute" and "Chronic" for problem Acuity
  And user enters today date in Onset Date
  And Resp Provider is populated with current user
  And Service is populated with current clinic appointment
  And each treatment factor has "Yes" and "No" buttons
  And user Adds Comment "test comment" for a problem
  And user clicks "Add Active Problem" button
Then the problem is added in the Active Problem list

