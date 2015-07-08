@F132_AllergyWriteBack @F132 @onc

Feature: F132 - Allergies (write-back)

#POC: Team Saturn

Background:
	Given user is logged into eHMP-UI
	And user searches for and selects "TWELVE,PATIENT"
	Then Cover Sheet is active


@AllergyFormCanceled @US2287 @US2354 @onc 
Scenario: Canceling out of Allergy Modal and verify that allergy not added 
	Then the user click on Allergies Expand View
	Then the "Allergy Grid" displays 
	When the Allergy user clicks "Add Item"
	Then the "Add New Allergy" Banner displays
	Then the modal contains the allergen search input
	Given the user enters allergy Search "YAMS"

	Then the search results populate "YAMS"
	Given the user selects allergen "YAMS"
	Then the add modal title is "Enter Allergy/Adverse Reaction for YAMS"
	When the Allergy user clicks "Cancel"
	Then the "Allergy Grid" displays
	Then the Allergy user clicks "AllergyRefresh"
	Then the Allergies coversheet does not contains rows
		|YAMS || | ||  | |

@AllergyFormClosed @US2405 @US1934 @US2404 @onc
	Scenario:Testing back button and close button functionality
	Then the user click on Allergies Expand View
	Then the "Allergy Grid" displays 
	When the Allergy user clicks "Add Item"
	Then the "Add New Allergy" Banner displays
	Then the modal contains the allergen search input
	Given the user enters allergy Search "Pen"
	Then the search results populate "PENICILLIN"
	Given the user selects allergen "PENICILLIN"
	Then the add modal title is "Enter Allergy/Adverse Reaction for PENICILLIN"
	When the Allergy user clicks "Back"
	Then the "Add New Allergy" Banner displays
	When the Allergy user clicks "Close"
	Then the "Allergy Grid" displays

@AddingObservedAllergy @US1935  @US3014 @US2808 @onc 
Scenario: Adding new Allergy and validating results on coversheet (Observered Allergy). 

	Adding "Soy Milk" Allergy with this Test
	Then the user click on Allergies Expand View
	Then the "Allergy Grid" displays 
	When the Allergy user clicks "Add Item"
	Then the "Add New Allergy" Banner displays
	Then the modal contains the allergen search input
	Given the user enters allergy Search "SOY MILK"
	Then the search results populate "SOY MILK"
	Given the user selects allergen "SOY MILK"
	Then the add modal title is "Enter Allergy/Adverse Reaction for SOY MILK"
	When the Allergy user clicks "Observed"
	Given the user enters Reaction Date "11-10-2003"
	Then the user Selects Reaction of "Allergy"
	Given the user enters Symptoms Search "Pain"
	Given the user Selects symptoms_1 of "PAIN IN EYE"
	Given the user enters Comments "AddingObservedAllergy"
	When the Allergy user clicks "Severe"
	

	When Allergy User Selects "Add-Allergy"
	Then the "Allergy Grid" displays 


	Then the Allergy user clicks "AllergyRefresh"
	When the Allergy user clicks "AllergyFilter"
   	When the Allergy user enters Allergy name "SOY MILK"
   	
  	Then the Allergies coversheet table contains rows
	 |Allergen Name  | Standardized Allergen  | Reaction | Severity    |Entered By   |Facility |
	Then the Allergies coversheet table contains rows
	 |SOY MILK |Soy Milk| PAIN IN EYE | Mild    |   | |

	##Clean up steps: 
	#Removing the allergy added with this test (EIE) for Allergy-List page
	When user views screen "cover-sheet" in the eHMP-UI
	Then Cover Sheet is active
	And the coversheet shows the allergy "SOY MILK" and the user selects it

	Then the user clicks the EIE button
	Then the allergen Entered in Error modal appears
	Given the user has recorded "Removing soy milk Allergy comments"
	When the user clicks the Save button
	Then the "SOY MILK" reaction has been removed from the coversheet


@DuplicateAllergyVerification @US2473 @US2448 @US2810 @onc
Scenario: Adding POLLEN Allergy twice in this test to verify the Duplicate Allergy message
	#Adding "POLLEN" Allergy with this Test
	Then the user click on Allergies Expand View
	Then the "Allergy Grid" displays 
	When the Allergy user clicks "Add Item"
	Then the "Add New Allergy" Banner displays
	Then the modal contains the allergen search input
	Given the user enters allergy Search "POLLEN"
	Then the search results populate "POLLEN"
	Given the user selects allergen "POLLEN"
	Then the add modal title is "Enter Allergy/Adverse Reaction for POLLEN"
	When the Allergy user clicks "Observed"
	Given the user enters Reaction Date "11-10-2003"
	Then the user Selects Reaction of "Pharmacological"
	Given the user enters Symptoms Search "Pain"
	Given the user Selects symptoms_1 of "PAIN IN EYE"
	Given the user enters Comments "Duplicate Allergy Verification1"
	Given the user enters valid Reaction Time "01:36 a"
	When the Allergy user clicks "Moderate"
	Given the user Selects symptoms_2 of "PAIN OF BREAST"
	#When the Allergy user clicks "Add-Allergy"
	
	When Allergy User Selects "Add-Allergy"
	
	Then the "Allergy Grid" displays 
	Then the Allergy user clicks "AllergyRefresh"

##adding same allergy 2nd time to get duplicate allergy error
	When the Allergy user clicks "Add Item"
	Then the "Add New Allergy" Banner displays
	Then the modal contains the allergen search input
	Given the user enters allergy Search "POLLEN"
	Then the search results populate "POLLEN"
	Given the user selects allergen "POLLEN"
	Then the add modal title is "Enter Allergy/Adverse Reaction for POLLEN"
	When the Allergy user clicks "Observed"
	Given the user enters Reaction Date "11-10-2003"
	Then the user Selects Reaction of "Pharmacological"
	Given the user enters Symptoms Search "Pain"
	Given the user Selects symptoms_1 of "PAIN IN EYE"
	Given the user enters Comments "Duplicate Allergy Verification2"
	Given the user enters valid Reaction Time "01:36 a"
	When the Allergy user clicks "Moderate"
	Given the user Selects symptoms_2 of "PAIN OF BREAST"
	When the Allergy user clicks "Add-Allergy"

	Then the duplicate Allergy error displays: "Save Failed: Patient already has a POLLEN reaction entered. No duplicates allowed."
	When the Allergy user clicks "Cancel"
	Then the "Allergy Grid" displays 

##Clean up steps: 
	#Removing the allergy added with this test (EIE) for Allergy-List page
	When user views screen "cover-sheet" in the eHMP-UI
	Then Cover Sheet is active
	And the coversheet shows the allergy "POLLEN" and the user selects it

	Then the user clicks the EIE button
	Then the allergen Entered in Error modal appears
	Given the user has recorded "Removing pollen Allergy comments"
	When the user clicks the Save button
	Then the "Pollen" reaction has been removed from the coversheet

@ReactionTimeValidation  @US2404 @US2466  @US2743  @onc 
Scenario: Adding incorrect time format; validating client side errors
	Then the user click on Allergies Expand View
	Then the "Allergy Grid" displays 
	When the Allergy user clicks "Add Item"
	Then the "Add New Allergy" Banner displays
	Then the modal contains the allergen search input
	Given the user enters allergy Search "Pen"
	Then the search results populate "PENICILLIN"
	Given the user selects allergen "PENICILLIN"
	Then the add modal title is "Enter Allergy/Adverse Reaction for PENICILLIN"
	When the Allergy user clicks "Observed"
	Given the user enters Reaction Date "11-10-2003"
	Then the user enters invalid Reaction Time format "10:36"
	When the Allergy user clicks "Mild"
	
	##comment out client side error as it's removed with story 2466
	#Then the Invalid Time format error displays "Please enter the time in format HH:MMa or HH:MMp"
	
	Given the user enters valid Reaction Time "01:30 a"
	Then the user Selects Reaction of "Unknown"
	Given the user enters Symptoms Search "Pain"
	Given the user Selects symptoms_1 of "PAIN IN EYE"
	Given the user enters Comments "Reaction Time Validation"
	Then the user Entered symptoms_1 Date "11-11-2003"
	And the user Entered symptoms_1 Time "10:36 a"
	
	When the Allergy user clicks "Cancel"
	Then the "Allergy Grid" displays
	
@AddingAndRemovingMultiSymptoms @US2397 @US2302 @onc 
Scenario: Adding multiple symtoms and removing some verification 
	Then the user click on Allergies Expand View
	Then the "Allergy Grid" displays 
	When the Allergy user clicks "Add Item"
	Then the "Add New Allergy" Banner displays
	Then the modal contains the allergen search input
	Given the user enters allergy Search "Pen"
	Then the search results populate "PENICILLIN"
	Given the user selects allergen "PENICILLIN"
	Then the add modal title is "Enter Allergy/Adverse Reaction for PENICILLIN"
	Given the user enters Symptoms Search "Pain"
	Given the user Selects symptoms_1 of "PAIN IN EYE"
	Given the user enters Symptoms Search "Pain"
	Given the user Selects symptoms_2 of "PAIN OF BREAST"
	Given the user enters Comments "Adding Multi Symptoms1"
	Then the user Removes symptoms_1 of "PAIN IN EYE"
	When the Allergy user clicks "Cancel"
	Then the "Allergy Grid" displays
	
@AddingHistoricalAllergy @US2397 @US2396 @onc
Scenario: Adding Historical Allergy and validating results on coversheet
	Then the user click on Allergies Expand View
	Then the "Allergy Grid" displays 
	When the Allergy user clicks "Add Item"
	Then the "Add New Allergy" Banner displays
	Then the modal contains the allergen search input
	Given the user enters allergy Search "EGGS"
	Then the search results populate "EGGS"
	Given the user selects allergen "EGGS"
	Then the add modal title is "Enter Allergy/Adverse Reaction for EGGS"
	When the Allergy user clicks "Historical"
	Then the user Selects Reaction of "Pharmacological"
	Given the user enters Comments "HISTORICAL Allergy comments"
	When Allergy User Selects "Add-Allergy"
	Then the "Allergy Grid" displays 
	Then the Allergy user clicks "AllergyRefresh"
	When the Allergy user clicks "AllergyFilter"
   	When the Allergy user enters Allergy name "EGGS"
  	Then the Allergies coversheet table contains rows
		 |Allergen Name  | Standardized Allergen  | Reaction | Severity |Drug Class|Entered By   |Facility |
	Then the Allergies coversheet table contains rows
		 |EGGS |Raw egg| | |VACCINES, TOXOIDS, VACCINES/TOXOIDS, OTHER|  | |

##Clean up steps: 
	#Removing the allergy added with this test (EIE) for Allergy-List page
	When user views screen "cover-sheet" in the eHMP-UI
	#Then Cover Sheet is active
	And the coversheet shows the allergy "EGGS" and the user selects it

	Then the user clicks the EIE button
	Then the allergen Entered in Error modal appears
	Given the user has recorded "Removing eggs Allergy comments"
	When the user clicks the Save button
	Then the "Eggs" reaction has been removed from the coversheet
