@US4110 @future
Feature: F172 - User-Defined Screens - Screen Manager 
#Team Neptune
#Add full screen view test when functionality is implemented 

Background: 
    Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	And Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
	And the user navigates to the maximized gridster page
	And the user creates a new test screen
	And the user adds two of each applet to the test screen
	
Scenario: User changes views for active medications
	When the user selects "summary" view for "active medications"
	And filters for "diabetes" within "active medications"
	And clicks the "active medications refresh button"
	Then the "active medications coversheet" contains 2 items
	
Scenario: User changes views for active problems
	When the user selects "summary" view for "active problems 2"
	And the user selects "expanded" view for "active problems 1"
	And filters for "diabetes" within "active problems 1"
	And clicks the "active problems 1 refresh button"
	Then "active problems 1" contains 2 items
	And "active problems 2" is unaffected 

Scenario: User changes views for allergies
	When the user selects "trend" view for "allergies applet 1"
	And the user selects "summary" view for "allergies applet 2"
	And the user selects "expanded" view for "allergies applet 3"
	And filters for "cho" within "allergies applet 1"
	And clicks the "allergies applet 1 refresh button"
	Then "allergies applet 1" contains 2 items
	And "allergies applet 2" is unaffected
	And "allergies applet 3" is unaffected

Scenario: User changes views for appointments and visits
	When the user selects "summary" view for "appointments and visits 1"
	And the user selects "expanded" view for "appointments and visits 2"
	And filters for "1/10/2014" within "appointments and visits 1"
	And clicks the "appointments and visits 1 refresh button"
	Then "appointments and visits 1" contains 2 items
	And "appointments and visits 2" is unaffected

Scenario: User changes views for clinical reminders
	When the user selects "summary" view for "clinical reminders 1"
	And the user selects "expanded" view for "clinical reminders 2"
	And filters for "04" within "clinical reminders 1"
	And clicks the "clinical reminders 1 refresh button"
	Then "clinical reminders 1" contains 2 items
	And "clinical reminders 2" is unaffected

Scenario: User changes views for community health summaries
	When the user selects "summary" view for "community health summaries 1"
	And the user selects "expanded" view for "community health summaries 2"
	And filters for "conemaugh" within "community health summaries 1"
	And clicks the "community health summaries 1 refresh button"
	Then "community health summaries 1" contains 1 items
	And "community health summaries 2" is unaffected

Scenario: User changes views for documents
	When the user selects "expanded" view for "documents"
	And filters for "consul" within "documents"
	And clicks the "documents refresh"
	Then the "documents" contains 3 items

Scenario: User changes views for immunizations
	When the user selects "summary" view for "immunizations applet 2"
	And the user selects "expanded" view for "immunizations applet 1"
	And filters for "tdap" within "immunizations applet 1"
	And clicks the "immunizations applet 1 refresh button"
	Then "immunizations applet 1" contains 1 items
	And "immunizations applet 2" is unaffected 

Scenario: User changes views for lab results
	When the user selects "summary" view for "lab results 1"
	And the user selects "expanded" view for "lab results 2"
	And filters for "a" within "lab results 1"
	And clicks the "lab results 1 refresh button"
	Then "lab results 1" contains 0 items
	And "lab results 2" is unaffected

Scenario: User changes views for orders
	When the user selects "summary" view for "orders 1"
	And the user selects "expanded" view for "orders 2"
	And filters for "a" within "orders 1"
	And clicks the "orders 1 refresh button"
	Then "orders 1" contains 0 items
	And "orders 2" is unaffected

Scenario: User changes views for timeline
	When the user selects "expanded" view for "timeline"
	And filters for "tdap" within "timeline"
	And clicks the "timeline refresh"
	Then the "timeline" contains 1 items

Scenario: User changes views for vitals
	When the user selects "trend" view for "vitals 1"
	And the user selects "expanded" view for "vitals 2"
	And filters for "pulse" within "vitals 2"
	And clicks the "vitals 2 refresh button"
	Then "vitals 2" contains 1 items
	And "vitals 1" is unaffected
