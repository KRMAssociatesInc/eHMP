@F130 @NonVAMedModify @onc

Feature: F130 - Non-VA Medications (write-back)

# Team Saturn

Background:
	Given user is logged into eHMP-UI
	And user searches for and selects "Fourteen,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Fourteen,Patient 		|
		Then the Non VA Med user selects a visit
		Then Cover Sheet is active


@ModifyNonVAMed_Modify @US1966 @onc @DE424
Scenario: Modifying Non VA Med dosage, route, schedule and verifying results in applet
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active

	#When the user clicks the control "Date Filter Toggle" on the "Coversheet"
    #And the user clicks the date control "All" on the "Coversheet"
    #And the user clicks the control "Apply" on the "Coversheet"
    And the user has selected All within the global date picker

	Then the Med Review list contains "NON-VA"
	Then the Med user expands Non-VA med
	Then the Med user expands "Aspirin Tab" med panel
	When the Med user clicks "Modify" button
	Then the add modal title reads "ASPIRIN TAB,EC"
	Given the user has selected a dosage "162MG"
	Given the user has selected a schedule "ONCE"
	Given the user selects "notRecommended" Radio button
	Then the user entered comments: "Modify NonVAMed"
	Given the user has entered a start date "10/02/2014"
	Given the user selects "prn" check box
	#Then the preview contains text "162MG"
	Then the Med user clicks "Save"
	#Then the modal is closed
	#When user selects Meds Review from Coversheet dropdown
	#Then the Med Review is active

	#When the user clicks the control "Date Filter Toggle" on the "Coversheet"
    #And the user clicks the date control "All" on the "Coversheet"
    #And the user clicks the control "Apply" on the "Coversheet"
	And the user has selected All within the global date picker
	
	Then the Med Review list contains "NON-VA"
	Then the Med user expands Non-VA med
	Then the Med user expands "Aspirin Tab" med panel
	And the Med has "TAKE 2TABLETS BY MOUTH ONCE PRN"


@ModifyNonVAMed_Cancel @US1966 @onc @DE424
Scenario: Bring up modify modal and then cancel
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active

	#When the user clicks the control "Date Filter Toggle" on the "Coversheet"
    #And the user clicks the date control "All" on the "Coversheet"
    #And the user clicks the control "Apply" on the "Coversheet"
	And the user has selected All within the global date picker

	Then the Med Review list contains "NON-VA"
	Then the Med user expands Non-VA med
	Then the Med user expands "Aspirin Tab" med panel
	When the Med user clicks "Modify" button
	Then the add modal title reads "ASPIRIN TAB,EC"
	Given the user has selected a dosage "1950MG"
	Given the user has selected a schedule "Q2H"
	Given the user selects "prn" check box
	Given the user selects "notRecommended" Radio button
	Then the user entered comments: "@Modify_Cancel"
	#Then the preview contains text "TAKE 1950MG"
	When the Med user clicks "Cancel" button
	And the Med has "TAKE 2TABLETS BY MOUTH ONCE PRN"
