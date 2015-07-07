@F130 @NonVAMedWriteback @onc

Feature: F130 - Non-VA Medications (write-back)

# POC: Team Saturn

Background:
	Given user is logged into eHMP-UI
	And user searches for and selects "Fourteen,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Fourteen,Patient 		|

		Then the Non VA Med user selects a visit
		Then Cover Sheet is active

@NonVaMedNotRecommended @US1964 @onc
Scenario: Verification of NotRecommended
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active

	When the user clicks the control "Date Filter Toggle" on the "Coversheet"
    And the user clicks the date control "All" on the "Coversheet"
    And the user clicks the control "Apply" on the "Coversheet"

	When the Med user clicks "Add Non-VA-Med"
	Then the search modal title reads "Document Herbal/OTC/Non-VA Medications"
	Then the modal contains the Med search input
	Given the user enters in the Med Search "HALOPERIDOL TAB"
	Then the Med search results populate "HALOPERIDOL TAB"
	Given the user selects Med "HALOPERIDOL TAB"
	Then the add modal title reads "HALOPERIDOL"
	Given the user has selected a dosage "1MG"
	Given the user has selected a route "ORAL (BY MOUTH)"
	Given the user has selected a schedule "5XD"
	Given the user has entered a start date "10/02/2014"
	Given the user selects "prn" check box
	Given the user selects "notRecommended" Radio button
	Then the user entered comments: "NonVaMedNotRecommended-1"
	#Then the preview contains text "TAKE 1TABLET BY MOUTH 5XD PRN Start Date: 10/02/2014"
	Then the Med user clicks "Save"
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active
	Then the Med user expands Non-VA med panel
	And medication applet non-VA summary results contain
	| field               | value                       |
	| qualifiedName       | Haloperidol Tab             |

@NonVaMedRecommended @US1964 @onc @DE424
Scenario: Verifcation of 'Recommended'
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active

	#When the user clicks the control "Date Filter Toggle" on the "Coversheet"
    #And the user clicks the date control "All" on the "Coversheet"
    #And the user clicks the control "Apply" on the "Coversheet"
    And the user has selected All within the global date picker

	When the Med user clicks "Add Non-VA-Med"
	Then the search modal title reads "Document Herbal/OTC/Non-VA Medications"
	Then the modal contains the Med search input
	Given the user enters in the Med Search "HALOPERIDOL TAB"
	Then the Med search results populate "HALOPERIDOL TAB"
	Given the user selects Med "HALOPERIDOL TAB"
	Then the add modal title reads "HALOPERIDOL"
	Given the user has selected a dosage "1MG"
	Given the user has selected a route "ORAL (BY MOUTH)"
	Given the user has selected a schedule "5XD"
	Then the user entered comments: "NonVaMedRecommended_2a"
	Given the user has entered a start date "01/09/2014"
	Given the user selects "nonVAprovider" check box
	Given the user selects "recommended" Radio button
	Then the user entered comments: "NonVaMedRecommended_2b"
	Then the preview contains text "HALOPERIDOL TAB"
	Then the Med user clicks "Save"
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active
	Then the Med user expands Non-VA med panel
	And medication applet non-VA summary results contain
	|field               |value                       |
	|qualifiedName       |Haloperidol Tab             |

@NonVaMedUndeclared @US1964 @onc
	Scenario: Verification of 'nonVApharmacy' Checkbox and 'undeclared' radio button
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active

	#When the user clicks the control "Date Filter Toggle" on the "Coversheet"
    #And the user clicks the date control "All" on the "Coversheet"
    #And the user clicks the control "Apply" on the "Coversheet"
    And the user has selected All within the global date picker

	When the Med user clicks "Add Non-VA-Med"
	Then the search modal title reads "Document Herbal/OTC/Non-VA Medications"
	Then the modal contains the Med search input
	Given the user enters in the Med Search "HALOPERIDOL TAB"
	Then the Med search results populate "HALOPERIDOL TAB"
	Given the user selects Med "HALOPERIDOL TAB"
	Then the add modal title reads "HALOPERIDOL"
	Given the user has selected a dosage "1MG"
	Given the user has selected a route "ORAL (BY MOUTH)"
	Given the user has selected a schedule "5XD"
	Given the user has entered a start date "08/02/2014"
	Given the user selects "undeclared" Radio button
	Given the user selects "nonVApharmacy" check box
	Then the user entered comments: "NonVaMedUndeclared_3"
	Then the preview contains text "HALOPERIDOL TAB"
	Then the Med user clicks "Save"
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active
	Then the Med user expands Non-VA med panel
	And medication applet non-VA summary results contain
	| field               | value                       |
	| qualifiedName       | Haloperidol Tab             |

@NonVaMedPreview @US2396 @onc
Scenario: Preview verifcationa with NonVAPharmacy, NonVaProvider
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active

	#When the user clicks the control "Date Filter Toggle" on the "Coversheet"
    #And the user clicks the date control "All" on the "Coversheet"
    #And the user clicks the control "Apply" on the "Coversheet"
    And the user has selected All within the global date picker

	When the Med user clicks "Add Non-VA-Med"
	Then the search modal title reads "Document Herbal/OTC/Non-VA Medications"
	Then the modal contains the Med search input
	Given the user enters in the Med Search "HALOPERIDOL TAB"
	Then the Med search results populate "HALOPERIDOL TAB"
	Given the user selects Med "HALOPERIDOL TAB"
	Then the add modal title reads "HALOPERIDOL"
	Given the user has selected a dosage "1MG"
	Given the user has selected a route "ORAL (BY MOUTH)"
	Given the user has selected a schedule "5XD"
	Given the user has entered a start date "02/07/2014"
	Given the user selects "prn" check box
	Given the user selects "nonVApharmacy" check box
	Given the user selects "nonVAprovider" check box
	Given the user selects "recommended" Radio button
	Then the user entered comments: "NonVaMedPreview_4"
	Then the preview contains text "HALOPERIDOL TAB"
	Then the preview contains text "TAKE 1TABLET BY MOUTH 5XD PRN"
	Then the preview contains text "Non-VA medication recommended by VA provider.,"
	Then the preview contains text "Patient wants to buy from Non-VA pharmacy.,"
	Then the preview contains text "Medication prescribed by Non-VA provider."
	Then the Med user clicks "Back"
	Then the search modal title reads "Document Herbal/OTC/Non-VA Medications"
	Then the Med user clicks "Close"

@NonVaMedCancel @US2396 @onc
Scenario: Cancel button verification
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active

	#When the user clicks the control "Date Filter Toggle" on the "Coversheet"
    #And the user clicks the date control "All" on the "Coversheet"
    #And the user clicks the control "Apply" on the "Coversheet"
    And the user has selected All within the global date picker

	When the Med user clicks "Add Non-VA-Med"
	Then the search modal title reads "Document Herbal/OTC/Non-VA Medications"
	Then the modal contains the Med search input
	Given the user enters in the Med Search "GEFITINIB TAB"
	Then the Med1 search results populate "GEFITINIB TAB"
	Given the user selects Med1 "GEFITINIB TAB"
	Then the add modal title reads "GEFITINIB TAB"
	Given the user has selected a dosage "2MG"
	Given the user has selected a route "ORAL (BY MOUTH)"
	Given the user has selected a schedule "5XD"
	Given the user has entered a start date "02/06/2014"
	Given the user selects "prn" check box

	#Then the preview contains text "2MG ORAL (BY MOUTH) 5XD PRN Start Date: 02/06/2014"
	Then the user entered comments: "Test5- selecting cancel button"
	Then the Med user clicks "Cancel Button"
	Then the Med Review is active
	Then the Med user expands Non-VA med panel
	And medication applet non-VA summary results do not contain
	| field               | value                       |
	| qualifiedName       | GEFITINIB Tab 	            |
