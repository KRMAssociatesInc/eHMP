@F144_ActiveMedications @regression
Feature: F144 - eHMP Viewer GUI - Active Medications

# Team: Jupiter

Background:
  Given user is logged into eHMP-UI

@f144_active_medications_base
Scenario: User views active medications on coversheet
  Given user searches for and selects "One,Outpatient"
  When Cover Sheet is active
  Then the "Active Medications" applet is displayed
  And the "Active Medications Applet" table contains headers
    | Medication | Facility | 
  And the Active Medications Applet table contains rows
  | Medication | Facility | 
  | AMOXAPINE 150MG TAB (ACTIVE) TAKE TWO TABLETS BY MOUTH TWICE A DAY | BAY |

@f144_1_active_medications_applet_inclusion @US2954 @base
Scenario: Inclusion of the Active Medications applet into the coversheet.
  Given user searches for and selects "One,Outpatient"
  Then Cover Sheet is active
  And the coversheet is displayed
  Then the "Active Medications" applet is displayed
  And the "Active Medications Applet" table contains headers
    | Medication | Facility | 

#the way user can view detail view is changed, hence this scenario had debu tag 
@f144_2_activie_medications_deatail @US2954 @DE831 @debug
Scenario: Viewing modal details for  Active Medications.
  Given user searches for and selects "One,Outpatient"
  Then Cover Sheet is active
  And the coversheet is displayed
  When the user clicks the row that contains "AMOXAPINE" in the Active Medications Applet
  Then user selects the "Amoxapine Tablet" detail icon in Active Medications Applet
  Then the modal is displayed
  And the modal's title is "Medication - amoxapine tab"
  When the user clicks the modal "Close Button"
  Then the modal is closed
