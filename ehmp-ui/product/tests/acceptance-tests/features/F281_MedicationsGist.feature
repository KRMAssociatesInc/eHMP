#POC: Team Jupiter

@F281_medication_gist @regression
Feature: F281 - Intervention Gist View - Medication
As a clinician using the interventions active medication gist view I need a view of active outpatient 
medications that contains: the qualified medication name (to be replaced by normalized medication name) 

@base @F281_1_ActiveOutpatientMedicationGist @DE831 
Scenario: User is able to view all active outpatient medication in a gist view under overview
	Given user is logged into eHMP-UI
	And user searches for and selects "one,outpatient"	
	Then Overview is active
	Then the "ACTIVE MEDICATIONS" gist is displayed
	And the medication gist view has the following information
	  | Meidication name                     |  sig                                     |   
      | Amoxapine 150 MG Oral Tablet  		 |  TAKE TWO TABLETS BY MOUTH TWICE A DAY  	|
 

@F281_2_ActiveOutpatientMedicationGist @US3388 @US4274 @DE831  @DE1388
Scenario: User is able to view all active outpatient medication in a gist view under overview
	Given user is logged into eHMP-UI
	And user searches for and selects "one,outpatient"	
	Then Overview is active
	Then the "ACTIVE MEDICATIONS" gist is displayed
	And the medication gist view has the following information
	  | Meidication name                     |  sig                                     |  
      | Amoxapine 150 MG Oral Tablet  		 |  TAKE TWO TABLETS BY MOUTH TWICE A DAY  	|   
	When user clicks on "Amoxapine Tablet" medication name
	Then user selects the "Amoxapine Tablet" detail icon in Medications Gist
	Then the modal is displayed
    And the modal's title is "Medication - amoxapine tab"
	And the user clicks the modal "Close Button"
	And the modal is closed
	
@F281_3_ActiveMedicationGist_filter @US3669 @US4274 @DE831 @DE1269 
Scenario: User is able to filter medications by text
	Given user is logged into eHMP-UI
	And user searches for and selects "eightyeight,patient"
	Then Overview is active
	Then the "ACTIVE MEDICATIONS" gist is displayed
    When the user clicks the control "Filter Toggle" in the "Medications Gist applet"
    And the user inputs "Lisinopril" in the "Text Filter" control in the "Medications Gist applet"
    Then the medication gist view is filtered to 1 item
    And the medication gist view has the following information
	  | Meidication name                     |  sig                                     | 
      | Lisinopril 10 MG Oral Tablet  		 |  TAKE ONE TABLET BY MOUTH EVERY DAY  	|    

@F281_4_ActiveMedicationGist_ExpandView @US4274 @vimm @DE831  @DE1482
Scenario: View Medications Applet Single Page by clicking on Expand View
  Given user is logged into eHMP-UI
#  And user searches for and selects "TEN,PATIENT"
  And user searches for and selects "ONE,OUTPATIENT"
  Then Overview is active
  Then the "ACTIVE MEDICATIONS" gist is displayed
  When the user clicks the control "Expand View" in the "Medications Gist applet"
  Then "Meds Review" is active
  And the title of the page says "MEDICATION REVIEW" in Meds Review Applet
  And user sees "Outpatient Meds Group" and "Inpatient Meds Group" in Meds Review Applet
  
@F281_5_ActiveMedicationGist_Column_Sorting_Medication @US4684 @DE831
Scenario: Medication Applet is sorted by the column header medication
  Given user is logged into eHMP-UI
  And user searches for and selects "eightyeight,patient"
  Then Overview is active
  Then the "ACTIVE MEDICATIONS" gist is displayed
  When user clicks on the column header "Medication"
  Then "Medication" column is sorted in ascending order
  When user clicks on the column header "Medication"
  Then "Medication" column is sorted in descending order
  
@F281_6_ActiveMedicationGist_Column_Sorting_refills @US4684 @DE831
Scenario: Medication Applet is sorted by the column header medication
  Given user is logged into eHMP-UI
  And user searches for and selects "eightyeight,patient"
  Then Overview is active
  Then the "ACTIVE MEDICATIONS" gist is displayed
  When user clicks on the column header "Refills"
  Then "Refills" column is sorted in ascending order
  When user clicks on the column header "Refills"
  Then "Refills" column is sorted in descending order

