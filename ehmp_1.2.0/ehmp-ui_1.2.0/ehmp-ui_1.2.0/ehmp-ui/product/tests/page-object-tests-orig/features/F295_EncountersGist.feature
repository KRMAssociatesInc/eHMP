@F295_encounters_gist
Feature: F295 - Encounters Applet
	
#POC: Team Jupiter

Background:
	Given user is logged into eHMP-UI

# @F295_1_encounterGist_Admission_Visit @US3706
# Scenario: User views the encounters gist view
# 	Given user is logged into eHMP-UI
# 	And user searches for and selects "Zzzretiredonenineteen,Patient"	
# 	And Cover Sheet is active
#   	When user selects Overview from Coversheet dropdown
#   	Then Overview is active
#   	And user sees Encounters Gist
# 	And the Encounters Gist view contains "Admission"
# 	| Description	| Events	| age 	| 
# 	| Admission		| 3			| 20y	|	
# 	And the Encounters Gist view contains "Visit"
# 	| Description	| Events	| age 	| 		
# 	| Visit			| 3			| 19y	| 

@F295_1_encounterGist_Admission_Visit @US3706
Scenario: User views Admissions and Vists on the encounters gist view
	Given user searches for and selects "Zzzretiredonenineteen,Patient"	
  	When user views the Overview
  	Then the Encounters Gist applet is displayed
	And the Encounters Gist view contains "Admission"
	| Description	| Events	| age 	| 
	| Admission		| 3			| 20y	|	
	And the Encounters Gist view contains "Visit"
	| Description	| Events	| age 	| 		
	| Visit			| 3			| 19y	| 

# @F295_2_encounterGist_procedure @US3706
# Scenario: User views the encounters gist view
# 	Given user is logged into eHMP-UI
# 	And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"	
# 	And Cover Sheet is active
#   	When user selects Overview from Coversheet dropdown
#   	Then Overview is active
#   	And user sees Encounters Gist
# 	And the Encounters Gist view contains "Procedure"
# 	| Description	| Events	| age 	| 
# 	| Procedure		| 1			| 22y	|	

@F295_2_encounterGist_procedure @US3706
Scenario: User views Procedures on the encounters gist view
	Given user is logged into eHMP-UI
	And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"	
	When user views the Overview
  	Then the Encounters Gist applet is displayed
	And the Encounters Gist view contains "Procedure"
	| Description	| Events	| age 	| 
	| Procedure		| 1			| 22y	|	



