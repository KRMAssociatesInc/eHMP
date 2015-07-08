@F130 @NonVAMedModify @onc

Feature: F130 - Non-VA Medications (write-back)

# Team Saturn

  In order to validate nonVA meds can be modified
  As a clinician
  I want to be able to modify a nonVA med

Background:
  Given I have a browser available
  And I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
  And user searches for and selects "Fourteen,Patient"
  Then I can see the landing page
  And the "patient identifying traits" is displayed with information
	| field			|value 					|
	| patient name	|Fourteen,Patient  		|
  And the Non VA Med user selects a visit
  And Cover Sheet is active


@ModifyNonVAMed_Modify @US1966 @onc @DE424
Scenario: Modifying Non VA Med dosage, route, schedule and verifying results in applet
	When user selects Meds Review from Coversheet dropdown
	And the user selects the control "Date Filter Toggle" on the "Coversheet"
    And the user selects the date control "All" on the "Coversheet"
    And the user selects the control "Apply" on the "Coversheet"
	And the Med user expands Non-VA med
	And the Med user expands "Aspirin Tab" med panel
	And the Med user selects "Modify"
	And the add modal title reads "ASPIRIN TAB,EC"
	And the user selects a dosage "162MG"
	And the user selects a schedule "ONCE"
	And the user selects "notRecommended" Radio button
	And the user enters comments: "Modify NonVAMed"
	And the user has entered a start date "10/02/2014"
	And the user selects "prn" check box
	And the Med user clicks "Save"
 	And the user selects the control "Date Filter Toggle" on the "Coversheet"
  	And the user selects the date control "All" on the "Coversheet"
  	And the user selects the control "Apply" on the "Coversheet"
	Then the Med Review list contains "NON-VA"
	Then the Med user expands Non-VA med
	Then the Med user expands "Aspirin Tab" med panel
	And the Med has "TAKE 2TABLETS BY MOUTH ONCE PRN"


@ModifyNonVAMed_Cancel @US1966 @onc @DE424
Scenario: Bring up modify modal and then cancel
	When user selects Meds Review from Coversheet dropdown
	And the user selects the control "Date Filter Toggle" on the "Coversheet"
    And the user selects the date control "All" on the "Coversheet"
    And the user selects the control "Apply" on the "Coversheet"
	And the Med user expands Non-VA med
	And the Med user expands "Aspirin Tab" med panel
	And the Med user selects "Modify" button
	And the user entered comments: "@Modify_Cancel"
	And the Med user selects "Cancel" button
	Then the Med has "TAKE 2TABLETS BY MOUTH ONCE PRN"
