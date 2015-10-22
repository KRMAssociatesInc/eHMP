@F144_sensitivepatient @regression
Feature: user selects sensitive patient

#POC: Team Mercury

Background:
    Given user is logged into eHMP-UI

@select_sensitive_patient @triage
Scenario: user selects sensitive patient
    #And the User selects mysite and All
    And the User selects mysite
    And the User click on MySiteSearch
    And user enters full last name "zzzretfivefifty"
    And the user select patient name "ZZZRETFIVEFIFTY,PATIENT"
    And the user click on acknowledge restricted record
    #Then the user click on TestConfirm
    Then the user click on Confirm Selection
    Then the "patient identifying traits" is displayed with information
		| field			| value 				    |
		| patient name	| Zzzretfivefifty,Patient	|

