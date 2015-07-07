@VistA_Exch
Feature: F57 VistA Exchange
  Ability for external consumer (user/system) to request data for a given patient and data type for healthcare data that originates from all available VistA instances.  



@US369
Scenario: Patient Resource Directory lookup by DFN and site code
    Given a patient with id "E104"
    When a client requests the patient resource directory for patient with dfn "71" and site code "200"
    Then the endpoint responds back with a json object
    And that json object contains a json array called "link"
    And the response contains a link for datatype "vital" for ICN "E104"

@US251
Scenario: Synced Patient Record
    Given a patient with id "E2" has been synced
    When a client requests "vital" for patient with id "E2"
    Then the endpoint responds back with a json object
    And a successful response is returned within "60" seconds

@US253
Scenario: Non-synced Patient Record
    Given a patient with id "E7" has not been synced
    When a client requests "vital" for patient with id "E7"
    Then the response status must be accepted
    And the response header includes "Retry-After"
    And the response header of "Retry-After" has a value of "10"
    When a client requests "vital" for patient with id "E7"
    Then a successful response is returned within "60" seconds
    And the endpoint responds back with a json object
	

    



  
    
@US262
Scenario Outline: Client requests data in JSON format
	Given user is logged in
	And a patient with id "E1" has been synced
    Then the response status must be successful
	When an auth client requests data in "<contentType>" format
	Then an OK response is returned within "30" seconds
	And the response header includes "Content-Type"
    And the response header of "Content-Type" has a value of "<contentType>"
	And the endpoint responds back with a json object
	
	Examples:
	|contentType |
	|application/json		|
	|application/json+fhir 	|
    
    
@US262
Scenario Outline: Client requests data in XML format
	Given user is logged in
	And a patient with id "E1" has been synced
	When an auth client requests data in "<contentType>" format
	Then an OK response is returned within "10" seconds
	And the response header includes "Content-Type"
    And the response header of "Content-Type" has a value of "<contentType>"
	And the endpoint responds back with an xml object
	
	Examples:
	|contentType |
	|application/xml		|
	|application/xml+fhir 	|

@US262
Scenario:  Client attempts to request data in an invalid format
	Given user is logged in
	When an auth client requests data in invalid format
	Then a Not acceptable response is returned within "10" seconds

    
    
