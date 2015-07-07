
@F120_allergyapplet_dod

Feature: JLV GUI Refactoring to use VistA Exchange

  In order to view the allergies applet
  As a clinician
  I want to be able to search for a patient and verify identifying traits on the coversheet

  # POC: Team Mercury
  # Updated by Alderaan on Feb, 18th 2015

  Background:
	Given I have a browser available
	And I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
	Then I can see the landing page

  @US1446 @US2178
  Scenario: Verify current patient identifying traits
	When user searches for "Eight,Patient"
	And user selects "Eight,Patient"
	And user confirms the selection
	Then overview is active
	And the "patient_identifying_traits" is displayed in patient search
	  | field			| value 				|
	  | patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
	  | applet 					|
	  | ALLERGIES     		 	|