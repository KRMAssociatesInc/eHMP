@F130 @NonVAMedSearch @onc

Feature: F130 - Non-VA Medications (write-back)

# POC: Team Saturn

@AddMedicationSearch @US2453 @onc 
Scenario: User opens the modal to search for Non VA Med and then closed modal witout saving
	Given user is logged into eHMP-UI
	And user searches for and selects "Fourteen,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Fourteen,Patient 		|
		
		Then the Non VA Med user selects a visit
		Then Cover Sheet is active
	When user selects Meds Review from Coversheet dropdown
	
	
	Then the Med Review is active

	#When the user clicks the control "Date Filter Toggle" on the "Coversheet"
    #And the user clicks the date control "All" on the "Coversheet"
    #And the user clicks the control "Apply" on the "Coversheet"
    And the user has selected All within the global date picker
	
	When the Med user clicks "Add Non-VA-Med"
	Then the search modal title reads "Document Herbal/OTC/Non-VA Medications"
	Then the modal contains the Med search input
	Given the user enters in the Med Search "MEPERIDINE TAB"
	Then the Med2 search results populate "MEPERIDINE TAB"
	When the Med user clicks "Close"
	Then the Med Review is active
	Given the user Selects "Non-VA"
	And medication applet non-VA summary results do not contain
	| field               | value                       |
	| qualifiedName       | PENBRITIN 	           	    |