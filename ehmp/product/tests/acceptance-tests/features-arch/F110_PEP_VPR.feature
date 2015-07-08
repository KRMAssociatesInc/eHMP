@PEP @PEP_VPR
Feature: F110 Integration of Authentication/Authorization into the VistA Exchange API

#This feature integrates the Axiomatics access control functionality into the VistA Exchange API to support user authorization, enforcement of the "approved CPRS user" flag, and "patient sensitivity calculation". It also audits any "break the glass" user actions into VistA.

@US1174 @PEP_VPR 
Scenario: Client gets a sensitive patient warning (break the glass scenario) when requesting demographics for a sensitive patient
	Given a patient with "demographics" in multiple VistAs
	When the client requests demographics for that patient "9E7A;167" in VPR format
	Then a temporary redirect response is returned


@US1174 @PEP_VPR  
Scenario: Client can break the glass after being warned when requesting demographics for a sensitive patient
	Given a patient with "demographics" in multiple VistAs
	When the client requests demographics for that patient "9E7A;167" in VPR format
	Then a temporary redirect response is returned
	When the client breaks glass and repeats a request for demographics for that patient "9E7A;167" in VPR format
	Then a successful response is returned

      
@US1174 @PEP_VPR
Scenario: Non-CPRS user cannot access patient demographics
	Given a patient with "demographics" in multiple VistAs
	When a user "9E7A;lu1234" with password "lu1234!!" requests demographics for that patient "10105V001065" in VPR format
	Then a forbidden response is returned


@US1385 @PEP_VPR
Scenario: Patient with different sensitivity levels on multiple VistAs
	Given a patient with "demographics" in multiple VistAs
#	When the client requests demographics for that patient "C877;18" in VPR format
#	Then a temporary redirect response is returned
#	When the client breaks glass and repeats a request for demographics for that patient "C877;18" in VPR format
#	Then a successful response is returned
#	When the client requests demographics for that patient "9E7A;18" in VPR format
#	Then a temporary redirect response is returned
#	When the client breaks glass and repeats a request for demographics for that patient "9E7A;18" in VPR format
#	Then a successful response is returned
	When the client requests demographics for that patient "5123456789V027402" in VPR format
	Then a temporary redirect response is returned
	When the client breaks glass and repeats a request for demographics for that patient "5123456789V027402" in VPR format
	Then a successful response is returned
