@F132 @AllergyEnteredInError @onc

Feature: F132 - Allergies (write-back)

#POC:Team Saturn

  In order to verify an allergy entered in error
  As a clinician
  I want to be able to verify allergies entered in error can be removed

  Background:
	Given I have a browser available
	And I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
	And user searches for and selects "TWELVE,PATIENT"
	Then Cover Sheet is active
	And the "patient identifying traits" is displayed with information
	  | field			| value 				|
	  | patient name	| Twelve,Patient 		|

@MarkNewAllergyEnteredInError @US1968 @onc
Scenario: Adding an allergy and then marking it as "Entered in Error"
	When the user selects the add allergy button
	And "Bee Stings" allergy has been recorded for this patient
	And the user selects on Allergies Expand View
	And the Allergy user selects "AllergyFilter"
   	And the Allergy user types Allergy name "BEE STINGS"
  	And the Allergies coversheet table contains rows
	 |Allergen Name  | Standardized Allergen  | Reaction | Severity    |Entered By   |Facility |
	And the Allergies coversheet table contains rows
	 |BEE STINGS |Bee Stings|  |    |   | |
	And user views screen "cover-sheet" in the eHMP-UI
	And Cover Sheet is active
	And the coversheet shows the allergy "BEE STINGS" and the user selects it
	And the user clicks the EIE button
	And the allergen Entered in Error modal appears
	And the user has recorded "clever comments"
	And the user clicks the Save button
	Then the "BEE STINGS" reaction has been removed from the coversheet