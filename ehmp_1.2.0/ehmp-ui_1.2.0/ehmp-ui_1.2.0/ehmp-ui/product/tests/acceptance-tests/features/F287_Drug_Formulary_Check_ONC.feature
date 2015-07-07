@F287_Drug_Formulary_Check @OBE @future
Feature: F287 - Drug Formulary Check (ONC)

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI

  
  @F287_Preferred_Drug_Formulary_ONC_Meds @US3197 @TA11504 @OBE
   Scenario: Verify Preferred Drug Formulary data is displayed
   Given user searches for and selects "Eighteen,Patient"
   When user selects Medication Review from Coversheet dropdown
   When the user clicks button to add medication order
   And the user clicks on "Clinic Appointments" tab
   And the user selects Primary Care
   And the user clicks the "Confirm" button
   And the user clicks outpatient med  
   # Then the modal contains the outpatient Med search input
   Then the user enters in the Med Search "SIMVASTATIN"
   Then the Med search results contains ONC item-1 "SIMVASTATIN TAB"
   Given the user enters in the Med Search "Lorazepam"
   Then the Med search results contains ONC item-2 "LORAZEPAM TAB"
   Given the user enters in the Med Search "Lantus"
   Then the Med search results contains ONC item-3 "LANTUS <PRAMLINTIDE PEN INJ,SOLN >"

