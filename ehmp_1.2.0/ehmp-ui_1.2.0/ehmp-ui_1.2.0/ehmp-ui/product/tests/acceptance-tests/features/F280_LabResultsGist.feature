@F280_Scope_Item @regression
Feature: F280 - Lab Results Applet
# Apply gist view type as an option against applet domains. "As an eHMP  user, I need to view a complete operation gist view to include the Labs domain that displays all defined panels and data; so that I can access Labs information for a given patient."

#POC: Team Venus

@F280_1_LabResultsGist_View @base @US4258
Scenario: Verfy lab results for patient using Overview Sheet
	Given user is logged into eHMP-UI
	And user searches for and selects "Five,Patient"
	Then Overview is active
	And the user has selected All within the global date picker
	And user sees Lab Results Gist
	Then the first coloumn of the Lab Results gist contains the rows for patient "Five,Patient"
		| col1            |
		| HDL             |
		| TRIGLYCERIDE    |
		| LDL CHOLESTEROL |
		| CHOLESTEROL     |
		| CREATININE      |
		| UREA NITROGEN   |
		| HEMOGLOBIN A1C  |
		| POTASSIUM       |

@F280_2_LabResultsGist_View @US4258
Scenario: Verfy lab results for patient using Overview Sheet
	Given user is logged into eHMP-UI
	And user searches for and selects "Ten,Patient"
    Then Overview is active
	And the user has selected All within the global date picker
    And user sees Lab Results Gist
    Then the first coloumn of the Lab Results gist contains the rows for patient "Ten,Patient"
  		| col1                                    |
  		| Leukocytes                              |
  		| Granulocytes/100 Leukocytes             |
  		| Platelet Mean Volume                    |
  		| Basophils/100 Leukocytes                |
  		| Eosinophils/100 Leukocytes              |
  		| Hemoglobin                              |
  		| Lymphocytes/100 Leukocytes              |
  		| Monocytes/100 Leukocytes                |
  		| Platelets                               |
  		| Erythrocyte Mean Corpuscular Hemoglobin |
  		| Erythrocyte Mean Corpuscular Hemoglobin Concentration |
  		| Mean Corpuscular Volume                 |
  		| Erythrocyte Distribution Width CV       |
  		| Erythrocytes                            |
  		| Hematocrit                              |
