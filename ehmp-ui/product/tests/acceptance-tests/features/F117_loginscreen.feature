@F117 @regression
Feature: Logon screen validates credentials using ehmpui_url User service:

#Team Mercury

@LoginWithDiffFacility
Scenario: Login to ehmpui_url
    Given user views the login screen
    When user attempts login
        | field      | value    |
        | Facility   | KODAK    |
        | AccessCode | pu1234   |
        | VerifyCode | pu1234!! |
        | SignIn     |          |
    Then the patient search screen is displayed

@Logout 
Scenario: Test logout after successful login
    Given user views the login screen
    When user attempts login
        | field      | value    |
        | Facility   | KODAK    |
        | AccessCode | pu1234   |
        | VerifyCode | pu1234!! |
        | SignIn     |          |
    Then the patient search screen is displayed
    Then the user attempts signout

@NoCPRSTabAccessLogin @US2990 @DE685 @DE1477
Scenario: Attempt login with No CPRS Tab Access
    Given user views the login screen
    When user attempts login
        |field | value|
        |Facility|PANORAMA|
        |AccessCode|lu1234|
        |VerifyCode|lu1234!!|
        |SignIn||
    Then the page displays "User is not authorized to access this system."

@UnsuccessfulLogin @DE685 @DE1734
Scenario: Attempt login with incorrect credentials
    Given user views the login screen
    When user attempts login
        |field | value|
        |Facility|PANORAMA|
        |AccessCode|kkk1234|
        |VerifyCode|pu12lkk!!|
        |SignIn||
    Then the page displays "Not a valid ACCESS CODE/VERIFY CODE pair."

@BlankFelled
Scenario:Test valid login when felled is blank
    Given user views the login screen
    When user attempts login
        |field | value|
        |Facility|PANORAMA|
        |AccessCode||
        |VerifyCode|pu1234!!|
        |SignIn||
    Then the page displays "Please ensure all fields have been entered"
    When user attempts login
        |field | value|
        |Facility|PANORAMA|
        |AccessCode|pu1234|
        |VerifyCode||
        |SignIn||
    Then the page displays "Please ensure all fields have been entered"

@CaseSensitive_1
Scenario:Test login screen is not CaseSensitive
    Given user views the login screen
    When user attempts login
        | field      | value    |
        | Facility   | KODAK    |
        | AccessCode | PU1234   |
        | VerifyCode | pu1234!! |
        | SignIn     |          |
    Then the patient search screen is displayed

@CaseSensitive_2
Scenario:Test login screen is not CaseSensitive
    Given user views the login screen
    When user attempts login
        | field      | value    |
        | Facility   | KODAK    |
        | AccessCode | pu1234   |
        | VerifyCode | PU1234!! |
        | SignIn     |          |
    Then the patient search screen is displayed

@appletWithoutLogin
Scenario: Test attempt to go directly to applet without login
   Given user attempt to go directly to the applet without login
   Then user is redirected to SignIn page

@IncorrectSubpage
Scenario: Test attempt to go directly to applet with incorrect subpage
   Given user attempt to go directly to applet with incorrect subpage
   Then user is redirected to SignIn page

@SuccessfulLogin  
Scenario: Login to ehmpui_url
    Given user views the login screen
    When user attempts login
        |field | value|
        |Facility|PANORAMA|
        |AccessCode|pu1234|
        |VerifyCode|pu1234!!|
        |SignIn||
    Then the patient search screen is displayed