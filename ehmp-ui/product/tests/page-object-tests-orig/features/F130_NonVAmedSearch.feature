@F130 @NonVAMedSearch @onc

Feature: F130 - Non-VA Medications (write-back)

# POC: Team Saturn

  In order to search for nonVA meds
  As a clinician
  I want to be able to search for a nonVA med

	Background:
	Given I have a browser available
	And I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
  	And user searches for and selects "Fourteen,Patient"
	Then Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Fourteen,Patient 		|
  	And the Non VA Med user selects a visit
  	And Cover Sheet is active

  @AddMedicationSearch @US2453 @onc
  Scenario: User opens the modal to search for Non VA Med and then closed modal without saving
  	When user selects Meds Review from Coversheet dropdown
	And the user selects the control "Date Filter Toggle" on the "Coversheet"
    And the user selects the date control "All" on the "Coversheet"
    And the user selects the control "Apply" on the "Coversheet"
	And the Med user selects "Add Non-VA-Med"
	And the user enters in the Med Search "MEPERIDINE TAB"
	Then the Med2 search results populate "MEPERIDINE TAB"
	And the Med user selects "Close"
	And the user Selects "Non-VA"
	And medication applet non-VA summary results do not contain
	| field               | value                       |
	| qualifiedName       | PENBRITIN 	           	    |