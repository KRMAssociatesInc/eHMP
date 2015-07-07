@F117_defaultscreeen @debug @DE153 @regression
Feature:  Open app to default screen verify all expected components displayed

#Team Mercury
@DefaultScreen 
Scenario: Login to ehmpui_url
    Given user views the login screen
    When user attempts login
        |field | value|
        |Facility|PANORAMA|
        |AccessCode|pu1234|
        |VerifyCode|pu1234!!|
        |SignIn||
    And the patient search screen is displayed

@DefaultScreen1
Scenario: If a user has not logged in, the default screen is login
	Given user views the login screen
	When the user accesses the base url
	Then the login screen is displayed

@DefaultScreen2
Scenario: If a user has logged in, but not set a patient context, the default screen is patient screen
	Given user is logged into eHMP-UI   
	When the user accesses the base url     
    Then the patient search screen is displayed

@DefaultScreen3
Scenario: if a user has logged in and set a patient contect, the default screen is coversheet
	Given user is logged into eHMP-UI
	And user searches for and selects "BCMA,Eight"
	Then Cover Sheet is active
	When the user accesses the base url
	Then Cover Sheet is active
