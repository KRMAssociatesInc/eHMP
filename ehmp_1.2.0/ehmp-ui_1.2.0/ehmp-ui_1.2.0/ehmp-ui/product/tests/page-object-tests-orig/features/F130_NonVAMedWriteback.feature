@F130 @NonVAMedWriteback @onc

Feature: F130 - Non-VA Medications (write-back)

# POC: Team Saturn

  In order to verify nonVA meds
  As a clinician
  I want to be able to verify nonVA meds

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

@NonVaMedNotRecommended @US1964 @onc
Scenario: Verification of NotRecommended
	When user selects Meds Review from Coversheet dropdown
	And the user selects the control "Date Filter Toggle" on the "Coversheet"
    And the user selects the date control "All" on the "Coversheet"
    And the user selects the control "Apply" on the "Coversheet"
	And the Med user selects "Add Non-VA-Med"
	And the user types the Med Search "HALOPERIDOL TAB"
	And the user selects Med "HALOPERIDOL TAB"
  	And the user selects a dosage "1MG"
  	And the user selects a route "ORAL (BY MOUTH)"
  	And the user selects a schedule "5XD"
  	And the user types a start date "10/02/2014"
  	And the user selects "prn" check box
  	And the user selects "notRecommended" Radio button
  	And the user types comments: "NonVaMedNotRecommended-1"
  	And the Med user clicks "Save"
  	And user selects Meds Review from Coversheet dropdown
  	And the Med Review is active
  	And the Med user expands Non-VA med panel
	Then medication applet non-VA summary results contain
		| field               | value                       |
		| qualifiedName       | Haloperidol Tab             |

@NonVaMedRecommended @US1964 @onc @DE424
Scenario: Verifcation of 'Recommended'
	When user selects Meds Review from Coversheet dropdown
	And the user selects the control "Date Filter Toggle" on the "Coversheet"
    And the user selects the date control "All" on the "Coversheet"
    And the user selects the control "Apply" on the "Coversheet"
	And the Med user selects "Add Non-VA-Med"
	And the user types in the Med Search "HALOPERIDOL TAB"
	And the user selects Med "HALOPERIDOL TAB"
	And the user selects a dosage "1MG"
	And the user selects a route "ORAL (BY MOUTH)"
	And the user selects a schedule "5XD"
	And the user types comments: "NonVaMedRecommended_2a"
	And the user types a start date "01/09/2014"
	And the user selects "nonVAprovider" check box
	And the user selects "recommended" Radio button
	And the user entered comments: "NonVaMedRecommended_2b"
	And the Med user clicks "Save"
	And user selects Meds Review from Coversheet dropdown
	And the Med Review is active
	And the Med user expands Non-VA med panel
	Then medication applet non-VA summary results contain
	|field               |value                       |
	|qualifiedName       |Haloperidol Tab             |

@NonVaMedUndeclared @US1964 @onc
	Scenario: Verification of 'nonVApharmacy' Checkbox and 'undeclared' radio button
  	When user selects Meds Review from Coversheet dropdown
  	And the user selects the control "Date Filter Toggle" on the "Coversheet"
  	And the user selects the date control "All" on the "Coversheet"
  	And the user selects the control "Apply" on the "Coversheet"
  	And the Med user selects "Add Non-VA-Med"
  	And the user types in the Med Search "HALOPERIDOL TAB"
  	And the user selects Med "HALOPERIDOL TAB"
  	And the user selects a dosage "1MG"
  	And the user selects a route "ORAL (BY MOUTH)"
  	And the user selects a schedule "5XD"
  	And the user types a start date "08/02/2014"
  	And the user selects "undeclared" Radio button
	And the user selects "nonVApharmacy" check box
	And the user types comments: "NonVaMedUndeclared_3"
	And the Med user clicks "Save"
	And user selects Meds Review from Coversheet dropdown
	And the Med Review is active
	And the Med user expands Non-VA med panel
	Then medication applet non-VA summary results contain
		| field               | value                       |
		| qualifiedName       | Haloperidol Tab             |

@NonVaMedPreview @US2396 @onc
Scenario: Preview verification with NonVAPharmacy, NonVaProvider
  	When user selects Meds Review from Coversheet dropdown
  	And the user selects the control "Date Filter Toggle" on the "Coversheet"
  	And the user selects the date control "All" on the "Coversheet"
  	And the user selects the control "Apply" on the "Coversheet"
  	And the Med user selects "Add Non-VA-Med"
  	And the user types in the Med Search "HALOPERIDOL TAB"
  	And the user selects Med "HALOPERIDOL TAB"
  	And the user selects a dosage "1MG"
  	And the user selects a route "ORAL (BY MOUTH)"
  	And the user selects a schedule "5XD"
	And the user types a start date "02/07/2014"
	And the user selects "prn" check box
	And the user selects "nonVApharmacy" check box
	And the user selects "nonVAprovider" check box
	And the user selects "recommended" Radio button
	And the user types comments: "NonVaMedPreview_4"
	Then the preview contains text "HALOPERIDOL TAB"
	And the preview contains text "TAKE 1TABLET BY MOUTH 5XD PRN"
	And the preview contains text "Non-VA medication recommended by VA provider.,"
	And the preview contains text "Patient wants to buy from Non-VA pharmacy.,"
	And the preview contains text "Medication prescribed by Non-VA provider."


@NonVaMedCancel @US2396 @onc
Scenario: Cancel button verification
  	When user selects Meds Review from Coversheet dropdown
  	And the user selects the control "Date Filter Toggle" on the "Coversheet"
  	And the user selects the date control "All" on the "Coversheet"
  	And the user selects the control "Apply" on the "Coversheet"
  	And the Med user selects "Add Non-VA-Med"
	And the user types in the Med Search "GEFITINIB TAB"
	And the user selects Med1 "GEFITINIB TAB"
  	And the user selects a dosage "2MG"
  	And the user selects a route "ORAL (BY MOUTH)"
  	And the user selects a schedule "5XD"
  	And the user types a start date "02/06/2014"
  	And the user selects "prn" check box
  	And the user types comments: "Test5- selecting cancel button"
  	And the Med user selects "Cancel Button"
	And the Med Review is active
	And the Med user expands Non-VA med panel
	Then medication applet non-VA summary results do not contain
		| field               | value                       |
		| qualifiedName       | GEFITINIB Tab 	            |
