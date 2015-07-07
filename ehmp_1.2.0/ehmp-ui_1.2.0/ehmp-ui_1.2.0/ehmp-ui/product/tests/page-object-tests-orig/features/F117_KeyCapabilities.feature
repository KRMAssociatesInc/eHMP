
@F117_crosscutting

Feature: F117 provides cross cutting UI concerns including: displaying the current patient identifying traits,
  displaying the application version, and providing screen-to-screen navigation.

  In order to identify current patient identifying traits
  As a clinician
  I want to return to the patient search screen and display identifying traits

# POC: Team Mercury
# Updated by Alderaan on Feb, 18th 2015

  Background:
	#Given I have a browser available
	#And I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
	#Then I can see the landing page

  @US2145
  Scenario: Verify current patient identifying traits, application version and screen to screen navigation
	When User searches for "Ten,Patient"
	And User selects "Ten,Patient"
	Then "Ten,Patient" displays information
	  #| html 			| value 				|
	  #| DOB         	| 04/07/1935            |
	  #| Age         	| 79y                   |
	  #| Gender          | Male                  |
	 # | SSN 			| ***-**-0010			|
	And "Bottom Region" contains "eHMP version"
	And the navigation bar displays the Patient Search Button  # this should change to confirm selection
	And the "patient_identifying_traits" screen is displayed
      #| html 			| value 				|
	  #| DOB         	| 04/07/1935            |
	  #| Age         	| 79y                   |
	  #| Gender          | Male                  |
	 # | SSN 			| ***-**-0010			| 



