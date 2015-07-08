
Feature: F286 - CCOW/Single Sign On (SSO): ADK and RDK updates (manual tests)

#Designed by Team Orion. Scenarios test general single sign-on capabilities between CPRS and EHMP, and tests unique situations when CCOW components are not available at different points in the workflow.

#CCOW SSO test when Vergence Vault running
@US3557 @debug @manual @ccow
Scenario: Verify that patient context is sync'd when a vault is running  
	Given a vault is running
	And CPRS user is logged in 
	And  a patient is selected 
	When user has launched eHMP from CPRS Tools Menu
	Then user is logged in automatically in eHMP
	And patient context is sync'd

#CCOW SSO test when Vergence Vault is not running. 
@US3557 @debug @manual @ccow
Scenario: Verify that user can manually login eHMP and selects patient when no vault is running 
	Given no vault is running
	And CPRS user is logged in 
	And  a patient is selected
	When user has launched eHMP from CPRS Tool Menu
	Then eHMP login screen is visible
	And user can login to eHMP manually
	And user can select patient manually

#CCOW SSO test when Vergence Vault is stopped
@US3557 @debug @manual @ccow
Scenario: Verify that user can manually login to eHMP and select a patient when vault is stopped
	Given a vault is running
	And CPRS user is logged in 
	And  a patient is selected 
	When Vault is stopped 
	And user has launched eHMP from CPRS Tool Menu
	Then eHMP login screen is visable
	And user can login to eHMP manually
	And user can select patient manually

#CCOW SSO testing using two CPRS Shortcuts with matching patient records
@US3557 @debug @manual @ccow
Scenario: Verify that SSO works launching eHMP from a second CPRS session with matching patient
	Given a Vault is running
    And CPRS user is logged in 
	And a patient is selected
	And eHMP is launched from CPRS Tool Menu 
	And login is processed automatically
	And patient is selected in eHMP automatically
	When user launches separate CPRS shortcut pointing to a different site
	And user logs in with a new Access Code and Verify Code
    And user sees the same patient as in the first CPRS/eHMP session
    And user launches eHMP from the new CPRS instance
	Then login is processed automatically
    And user is taken to the same patient as seen in CPRS.

#CCOW SSO test when CPRS suspends CCOW participation
@US3557 @debug @manual @ccow
Scenario: Verify that user is given the same patient when vault is running 
	Given a Vault is running
	And CPRS user is logged in 
	And patient A is selected
	And context link is suspended
    And patient B is selected
	When eHMP is launched from CPRS Tool Menu
	Then user is login automatically in eHMP
	And patient in eHMP is same as patient selected in CPRS prior to suspending context sync (Patient A)

#CCOW SSO test with Auto-logout to properly remove session from Vault
@US3655 @debug @manual @ccow
Scenario: User is logged out,Session is removed from the vault
	Given Vault is running
	And CPRS user is logged in 
	And eHMP user is logged in
	When eHMP user is logged out (time out) 
	Then the Vergence Vault does not show an eHMP session anymore




