@DemoHMP
Feature: Demo
    displayed in the HMP
   
Background:
#    Given user logs in with valid credentials
        

@HMP1001
Scenario: Successful Login to HMP Demo
	Given user lunch HMP
    When user logs in with valid credentials to HMPDemo
	Then the main page displays with title "HMP » CPE (Staging)"
	And the physician name display as "Vehu,Ten"
	
	
@HMP1002     
Scenario Outline: Attempt login with incorrect credentials
    Given user lunch HMP
    And user attempts login with incorrect credentials
        | field 		| value			|
        | Facility		| <facility>	|
        | AccessCode	| <accesscode>	|
        | VerifyCode	| <verifycode>	|
        | SignIn		||
    Then the page displays login error message
        

    Examples:
    | facility  	| accesscode	| verifycode 	|
    | HMP SANDBOX 	| badaccesscode | VEHU10		|
    | HMP SANDBOX 	| 10VEHU 		| badverifycode	|