@JLVPerformanceTesting
Feature: JLV Performance Testing
    JLV Performance Testing
   
Background:
#    Given user logs in with valid credentials
    
    

        

@Per001
Scenario: Capture response time for successful login to JLV
    Given user logs in with valid credentials to JLV
    Then capture response time for "successful login"
    Then user log out
  
    
@Per002
Scenario: Capture response time for patient search
    Given user logs in with valid credentials to JLV
    When a user search for patient with id
    	| field 			| value		|
        | SearchLastName 	| EIGHT		|
        | SearchIdentifier 	| 666000808	|
        | Search 			||
        
    Then capture response time for "patient search"
    Then user log out
   
    
@Per003
Scenario: Capture response time for not synched patient - to load Allergy 
    Given user logs in with valid credentials to JLV
    When a user search for patient with id
    	| field 			| value		|
        | SearchLastName 	| EIGHT		|
        | SearchIdentifier 	| 666000808	|
        | Search 			||
    
    And a patient with id "E1" has not been synced        
    Then user select the patient that has expected "Allergies" data as "CHOCOLATE"
    And capture response time for "not synched patient - Allergies"
    Then user log out

    
@Per004
Scenario: Capture response time for not synched patient - to load Vitals 
    Given user logs in with valid credentials to JLV
    When a user search for patient with id
    	| field 			| value		|
        | SearchLastName 	| EIGHT		|
        | SearchIdentifier 	| 666000808	|
        | Search 			||
   
    And a patient with id "E1" has not been synced     
    Then user select the patient that has expected "Vitals" data as "BLOOD PRESSURE"
    And capture response time for "not synched patient - Vitals"
    Then user log out

    
@Per005
Scenario: Capture response time for synched patient - to load Allergy 
    Given user logs in with valid credentials to JLV
    When a user search for patient with id
    	| field 			| value		|
        | SearchLastName 	| EIGHT		|
        | SearchIdentifier 	| 666000808	|
        | Search 			||
    
    And a patient with id "E1" has been synced
    Then user select the patient that has expected "Allergies" data as "CHOCOLATE"
    And capture response time for "synched patient - Allergies"
    Then user log out
    
    
@Per006
Scenario: Capture response time for synched patient - to load Vitals 
    Given user logs in with valid credentials to JLV
    When a user search for patient with id
    	| field 			| value		|
        | SearchLastName 	| EIGHT		|
        | SearchIdentifier 	| 666000808	|
        | Search 			||
    
    And a patient with id "E1" has been synced
    Then user select the patient that has expected "Vitals" data as "BLOOD PRESSURE"
    And capture response time for "synched patient - Vitals"
    Then user log out
    
 