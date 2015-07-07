@F130  @DiscontinueNonVaMed @onc 

Feature: F130 - Non-VA Medications (write-back)

# Team Saturn

  In order to validate nonVA meds can be discontinued
  As a clinician
  I want to be able to add a nonVA med and discontinue it

Background:

  Given I have a browser available
  And I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
  And user searches for and selects "TWELVE,PATIENT"
  Then I can see the landing page
  And the "patient identifying traits" is displayed with information
	| field			|value 					|
	| patient name	|Twelve,Patient 		|
  And the Non-VA Med user selects a visit before Med Discontinued


  @DiscontinueDefaultMed  @US2545 @onc
Scenario: Add a nonVA med to patient Twelve
	When user selects Meds Review from Coversheet dropdown
	And the Med user selects "Add Non-VA-Med"
	And the user types in the Med Search "HALOPERIDOL TAB"
	And the user selects Med "HALOPERIDOL TAB"
	And the user selects a dosage "1MG"
	And the user selects a route "ORAL (BY MOUTH)"
	And the user selects a schedule "5XD"
	And the user types a start date "01/21/2015"
	And the user selects "prn" check box
	And the user selects "notRecommended" Radio button
	And the user types a comment: "Discontinue Med Test"
	And the Med user Saves the form
  	And user selects Meds Review from Coversheet dropdown
  	And the user expands "Non-VA"
  	And medication applet non-VA summary results contain
		| field               | value                       |
		| qualifiedName       | Haloperidol Tab             |

  	And the Med user selects "HALOPERIDOL TAB" med panel
  	And the user selects "Discontinue" button
  	And the user selects the discontinue reason "Per Policy"
  	And the user selects discontinue
  	And user selects Meds Review from Coversheet dropdown
  	And the user expands "Non-VA"
  	And medication applet non-VA summary results contain
		| field               | value                       |
		| qualifiedName       | Haloperidol Tab             |
  	And the Med user selects "HALOPERIDOL TAB" med panel
  	Then the Non-VA med is discontinued
