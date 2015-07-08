#adding debug tag since logic for active medication changed.  So need to add data in vista
@F144_ActiveMedications @regression @debug
Feature: F144 - eHMP Viewer GUI - Active Medications

# Team: Jupiter

Background:
  Given user is logged into eHMP-UI

@f144_active_medications_base @base
Scenario: User views active medications on coversheet
  Given user searches for and selects "Ten,Patient"
  When Cover Sheet is active
  Then the "Active Medications" applet is displayed
  And the "Active Medications Applet" table contains headers
    | Medication | Facility | 
  And the Active Medications Applet table contains rows
  |row | Medication | Facility | 
  | 11  | Gabapentin 50mg/mL, (Neurontin), Solution, Oral, 5mL (Active) TEASPOONFUL | DOD |

@f144_1_active_medications_applet_inclusion @US2954
Scenario: Inclusion of the Active Medications applet into the coversheet.
  Given user searches for and selects "Ten,Patient"
  Then Cover Sheet is active
  And the coversheet is displayed
  Then the "Active Medications" applet is displayed
  And the "Active Medications Applet" table contains headers
    | Medication | Facility | 
 
@f144_2_activie_medications_deatail @US2954 @DE831 @debug
Scenario: Viewing modal details for  Active Medications.
  Given user searches for and selects "Ten,Patient"
  Then Cover Sheet is active
  And the coversheet is displayed
  When the user clicks the row that contains "Gabapentin 50mg/mL, (Neurontin), Solution, Oral, 5mL (Active)" in the Active Medications Applet
  Then the modal is displayed
  And the modal's title is "Medication - gabapentin 50mg/ml, (neurontin), solution, oral, 5ml"
  When the user clicks the modal "Close Button"
  Then the modal is closed
