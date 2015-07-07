@F137 @debug @manual
Feature: SDK Expansion and Enhancement: Implement Bootstrap Affix.js in App

@US2261 @future
Scenario: Use Affix to keep desired components in fixed position - Patient selection confirmation
	Given user attempt to go on to Patient search
    And user is logged into eHMP-UI
    And the User selects mysite and All
    And user enters full last name "Eight"
    #Then Patient Confirmation is still visible
    And the user select patient name "Eight,Imagepatient"
    Then Patient Confirmation is still visible
    When user scrolls
    Then Patient Confirmation is still visible

@US2261 @future @manual
Scenario: Patient Selection Confirmation is affixed
	Given user is logged into eHMP-UI 
	And user is viewing patient search screen
    When user enters full last name "ZZZ"
    Then multiple patients are displayed
    And the user select patient name "Zzzfortyfour,Patient"
    Then Patient confirmation is displayed
    When user scrolls
    Then the Patient confirmation does not move

@US2261 @future @manual
Scenario: Coversheet components are affixed
    Given user is logged into eHMP-UI
    Given user enters "Eight,Patient" in the search box
    And user views screen "cover-sheet" in the eHMP-UI
    When user scrolls
    Then the Patient Header does not move
    Then the Applet Navigation does not move
    Then the Main Navigation does not move
    Then the Main Footer does not move 

    
