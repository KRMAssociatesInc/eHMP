@F132 @AllergyEnteredInError @onc

Feature: F132 - Allergies (write-back)

#POC:Team Saturn
@MarkNewAllergyEnteredInError @US1968 @onc
Scenario: Adding an allergy and then marking it as "Entered in Error"

	Given user is logged into eHMP-UI
	And user searches for and selects "TWELVE,PATIENT"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Twelve,Patient 		|
	When the user clicks the add allergy button
	Then the Allergy search modal title is "Add New Allergy"
	Given "Bee Stings" allergy has been recorded for this patient
	Then the user click on Allergies Expand View
	Then the "Allergy Grid" displays
	When the Allergy user clicks "AllergyFilter"
   	When the Allergy user enters Allergy name "BEE STINGS"
  	Then the Allergies coversheet table contains rows
	 |Allergen Name  | Standardized Allergen  | Reaction | Severity    |Entered By   |Facility |
	Then the Allergies coversheet table contains rows
	 |BEE STINGS |Bee Stings|  |    |   | |
	When user views screen "cover-sheet" in the eHMP-UI
	Then Cover Sheet is active
	Then the user clicks the "Allergies Filter Button"
	And the coversheet shows the allergy "BEE STINGS" and the user selects it
	Then the user clicks the EIE button
	Then the allergen Entered in Error modal appears
	Given the user has recorded "clever comments"
	When the user clicks the Save button
	Then the "BEE STINGS" reaction has been removed from the coversheet