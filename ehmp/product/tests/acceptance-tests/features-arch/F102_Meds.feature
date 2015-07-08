@meds @future
Feature: F102 Return and display of inpatient and outpatient medications
# This feature file has UI test and the background UI rest request.  Since we don't want either to run in the jenkins pipeline
# I have marked the Feature as @future so the background step will also not be run

Background:
	Given a patient with pid "9E7A;71" has been synced through FHIR


@meds_rest
Scenario: Client can request meds
	Given a patient with "inpatient and outpatient medications" in multiple VistAs
	When the client requests Meds for the patient "9E7A;71"
	Then eHMP returns "40" result(s)
	And the results contain data group
		| field            | value                                             |
      	| summary     | ATENOLOL 100MG TAB (EXPIRED)\n TAKE ONE EVERY DAY |
      	| uid         | urn:va:med:9E7A:71:12007                          |
      	| vaStatus    | EXPIRED                                           |
      	| overallStop | 20010211                                          |
      	| vaType      | O                                                 |
      	| kind        | Medication, Outpatient                            |
    
    And the results contain data group
	  	| field       | value                                          |
      	| summary     | ASPIRIN 600MG SUPP,RTL (EXPIRED)\n AS DIRECTED |
      	| uid         | urn:va:med:9E7A:71:10976                       |
      	| vaStatus    | EXPIRED                                        |
      	| overallStop | 19991127	                                   |
      	| vaType      | O                                              |
      	| kind        | Medication, Outpatient                         |
      	
  	And the results contain data group
		| field                        | value                    |
	  	| products.ingredientName | PROLEUKIN INJ            |
	  	| uid                     | urn:va:med:9E7A:71:10987 |
	  	| vaStatus                | EXPIRED                  |
	  	| overallStop             | 199911252359             |
	  	| vaType	   			  | V						  |
	  	| kind 	   			   	  | Medication, Infusion	  |
	  	
      	
@meds_display @UI
Scenario: User can view requested meds in the eHMP UI
	Given user logged with valid credentials to HMP
	And a patient with "inpatient and outpatient medications" in multiple VistAs
    When user requests "meds" for the patient "Zzzretiredfortyeight,Patient"	
	And user selected "Meds Review" from tasks optien
    And user select "All Meds" from "Filters"   
    Then the result are displayed in the "Outpatient Meds Table"
		| name               | value    | date        | type   |
      	| Outpatient Meds 20 |          |             |        |
      	| ATENOLOL TAB       | 100 MG   | 11-Feb-2001 | Out Pt |
      	| ASPIRIN SUPP,RTL   | 600 MG   | 17-Nov-1999 | Out Pt |
      	| CODEINE INJ        | 30 MG/ML | 15-Sep-1999 | Out Pt |
	
	And user select "Inpatient Meds" from results table
	Then the result are displayed in the "Inpatient Meds Table"
		| name                                              | value        | date        | type |
      	| Inpatient Meds 2                                  |              |             |      |
      	| HEPARIN INJ,SOLN in DEXTROSE 5% IN WATER INJ,SOLN | 125 ml/hr IM | 11-Dec-1999 | IV   |
      	| PROLEUKIN INJ in DEXTROSE/SALINE INJ,SOLN         | 125 ml/hr IV | 25-Nov-1999 | IV   |
      	
		

      	
      