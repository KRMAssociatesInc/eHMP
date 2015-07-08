@PEP
Feature: F99 Policy Decision Point Integration (Access Control)s

#This feature provides the addition of Axiomatics access control functionality in the VistA Exchange product to support user authorization, enforcement of the "approved CPRS user" flag, and "patient sensitivity calculation". It also audits any "break the glass" user actions into VistA.

@US810
Scenario: Client gets a sensitive patient warning (break the glass scenario) when requesting demographics for a sensitive patient
	Given a patient with "demographics" in multiple VistAs
	When the client requests demographics for that patient "9E7A;167"
	Then a temporary redirect response is returned


@US810
Scenario: Client can break the glass after being warned when requesting demographics for a sensitive patient
	Given a patient with "demographics" in multiple VistAs
	When the client requests demographics for that patient "9E7A;167"
	Then a temporary redirect response is returned
	When the client breaks glass and repeats a request for demographics for that patient "9E7A;167"
	Then a successful response is returned

      
@US810
Scenario: Non-CPRS user cannot access patient demographics
	Given a patient with "demographics" in multiple VistAs
	When a user "9E7A;lu1234" with password "lu1234!!" requests demographics for that patient "10105V001065"
	Then a forbidden response is returned


@US1385
Scenario: Patient with different sensitivity levels on multiple VistAs
	Given a patient with "demographics" in multiple VistAs
	When the client requests demographics for that patient "5123456789V027402"
	Then a temporary redirect response is returned
	When the client breaks glass and repeats a request for demographics for that patient "5123456789V027402"
	Then a successful response is returned
