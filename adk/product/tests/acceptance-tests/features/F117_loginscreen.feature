@F117 @future
Feature: Logon screen validates credentials using ADK User service:


@SuccessfulLogin @future
Scenario: Login to ADK
    Given user views ADK in the browser
    And user attempts login
        |field | value|
        |Facility|Panorama|
        |AccessCode|lu1234|
        |VerifyCode|lu1234!!|
        |SignIn||
    And the main page displays
    Then the user attempts signout
  
@Logout @future
Scenario: Test logout after successful login
    Given user views ADK in the browser
    And user attempts login
        |field | value|
        |Facility|Panorama|
        |AccessCode|lu1234|
        |VerifyCode|lu1234!!|
        |SignIn||
    Then the user attempts signout

@LoginWithDiffFacility @future
Scenario: Login to ADK
    Given user views ADK in the browser
    And user attempts login
        |field | value|
        |Facility|Kodak|
        |AccessCode|10VEHU|
        |VerifyCode|VEHU10|
        |SignIn||
    Then the main page displays
    Then the user attempts signout
   
@UnsuccessfulLogin @future
Scenario: Attempt login with incorrect credentials
    Given user views ADK in the browser
    And user attempts login
        |field | value|
        |Facility|Panorama|
        |AccessCode|kkk1234|
        |VerifyCode|lu12lkk!!|
        |SignIn||
    Then the page displays "Login Error Message"

@casesensitive @future
Scenario:Test valid login (VerifyCode  is obfuscated, accesscode is case sensitive )
      Given user views ADK in the browser
      And user attempts login
        |field | value|
        |Facility|Panorama|
        |AccessCode|Lu1234|
        |VerifyCode|lu1234!!|
        |SignIn||
    Then the page displays "Login Error Message"
     And user attempts login
        |field | value|
        |Facility|Panorama|
        |AccessCode|Lu1234|
        |VerifyCode|Lu1234!!|
        |SignIn||
    Then the page displays "Login Error Message" 
        And user attempts login
        |field | value|
        |Facility|Kodak|
        |AccessCode|Lu1234|
        |VerifyCode|Lu1234!!|
        |SignIn||
    Then the page displays "Login Error Message" 

    @BlankFelled @future
Scenario:Test valid login when felled is blank
      Given user views ADK in the browser
      And user attempts login
        |field | value|
        |Facility|Panorama|
        |AccessCode||
        |VerifyCode|lu1234!!|
        |SignIn||
    Then the page displays "Login Error Message" 
     And user attempts login
        |field | value|
        |Facility|Panorama|
        |AccessCode|lu1234|
        |VerifyCode||
        |SignIn||
    Then the page displays "Login Error Message"

@appletWithoutLogin @future
Scenario: Test attempt to go directly to applet without login 
   Given user attempt to go directly to applet without login
   Then user is redirected to "SignIn" page 

@IncorrectSubpage  @future
Scenario: Test attempt to go directly to applet with incorrect subpage 
   Given user attempt to go directly to applet with incorrect subpage 
   Then user is redirected to "SignIn" page
