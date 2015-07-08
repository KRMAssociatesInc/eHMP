@F130  @DiscontinueNonVaMed @onc 

Feature: F130 - Non-VA Medications (write-back)

# Team Saturn

@DiscontinueDefaultMed  @US2545 @onc 
Scenario: Add a nonVA med to patient Twelve and then discontinue it.
	Given user is logged into eHMP-UI
	
	And user searches for and selects "TWELVE,PATIENT"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			|value 				|
		| patient name	|Twelve,Patient 		|

	Then the Non-VA Med user selects a visit before Med Discontinued
	Then Cover Sheet is active
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active
	When the Med user clicks "Add Non-VA-Med"
	Then the search modal title reads "Document Herbal/OTC/Non-VA Medications"
	Then the modal contains the Med search input
	Given the user enters in the Med Search "HALOPERIDOL TAB"
	Then the Med search results populate "HALOPERIDOL TAB"
	Given the user selects Med "HALOPERIDOL TAB"
	Then the add modal title reads "HALOPERIDOL TAB"
	Given the user has selected a dosage "1MG"
	Given the user has selected a route "ORAL (BY MOUTH)"
	Given the user has selected a schedule "5XD"
	Given the user has entered a start date "01/21/2015"
	Given the user selects "prn" check box
	Given the user selects "notRecommended" Radio button
	Then the user entered comments: "Discontinue Med Test"
	Then the Med user clicks "Save"
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active
	Given the user expands "Non-VA"
	And medication applet non-VA summary results contain
	| field               | value                       |
	| qualifiedName       | Haloperidol Tab             |

	Then the Med user selects "HALOPERIDOL TAB" med panel
	Then the user clicks "Discontinue" button
	Given the user selects the discontinue reason "Per Policy"
	Then the disc modal title reads "Discontinue HALOPERIDOL TAB"
	Then the user clicks discontinue
	When user selects Meds Review from Coversheet dropdown
	Then the Med Review is active
	Given the user expands "Non-VA"
	Then medication applet non-VA summary results contain
	| field               | value                       |
	| qualifiedName       | Haloperidol Tab             |
	Then the Med user selects "HALOPERIDOL TAB" med panel
	And the Non-VA med is discontinued

	
	
