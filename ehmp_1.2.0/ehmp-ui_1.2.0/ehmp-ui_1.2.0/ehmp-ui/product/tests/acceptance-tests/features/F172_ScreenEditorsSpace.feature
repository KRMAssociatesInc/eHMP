@future @US3983 @US3366 @US4084 @US4330 
Feature:F172 - User-Definition Screens - Screen Editors
#Team Neptune

Background: 
    Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	And Cover Sheet is active

@add_to_UDS
Scenario: Add allergies to a UDS
	When that a user defined screen has been created 
	And the "Editor's Carousel" contain 15 items
	Then drag and drop the Allergies right by 5 and down by 400
	And user clicks "Allergies Gist View" on the screen editor
	And drag and drop the Allergies preview right by 700 and down by 0
	And user clicks "Done" on the screen editor
	And drag and drop the Allergies applet right by -800 and down by 0
	And delete the test screen 

	
