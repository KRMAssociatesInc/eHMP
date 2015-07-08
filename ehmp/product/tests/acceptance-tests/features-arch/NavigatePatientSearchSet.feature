@NavigateSearchSet @UI
Feature: Use this file to demonstrate the ability to navigate between the different sets a user can
use to search for a patient.  This file can be deleted when customer approved user stories have
been created

Background:
    Given user has successfully logged into HMP
    
@SearchClinics @UI
Scenario: Search for patient by clinic
	When user searches in the "Clinics" patient set
	Then the page displays the "Search Clinics" popup
	Then user chooses the "Search Clinics close button"
	
@SearchWards @UI
Scenario: Search for patient by ward
	When user searches in the "Wards" patient set
	Then the page displays the "Search Wards" popup
	Then user chooses the "Search Wards close button"
	
@SearchAll @UI
Scenario: Search for patient by ward
	When user searches in the "All" patient set
