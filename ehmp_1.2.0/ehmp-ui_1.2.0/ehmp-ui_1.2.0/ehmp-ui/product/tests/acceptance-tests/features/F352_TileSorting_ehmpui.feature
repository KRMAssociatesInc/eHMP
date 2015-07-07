
#Team Orion

Feature: F352 - Tile Sorting
# Provide the ability to sort tiles within an applet on a user-defined workspace by dragging and dropping tiles in the trend/gist view .

Background: 
#Tests include background of adding all 4 relevant domain applets on a UDW, and viewing the workspace
    #Given user is logged into eHMP-UI
    #And user searches for and selects "EIGHT,PATIENT"
    #And Cover Sheet is active
    #And the "patient identifying traits" is displayed with information
     #   | field         | value                 |
      #  | patient name  | EIGHT,PATIENT |
    #When the user clicks "Workspace Manager Button"
    #And delete user defined workspaces
    #And the user clicks "Add New Button" 
    #And the user creates a new workspace titled "testTiles Workspace" with the description "testTiles Workspace"
    #And sets "testTiles Workspace" as the default workspace
    #And the user clicks "Launch"
    #And the user drags and drops the Conditions thumbnail right by 5 and down by 400
    #And user clicks "Trend View" on the workspace editor of Conditions
    #And the user drags and drops the Labs thumbnail right by 15 and down by 400
    #And user clicks "Trend View" on the workspace editor of Labs
    #And the user drags and drops the Meds thumbnail right by 25 and down by 400
    #And user clicks "Trend View" on the workspace editor of Meds
    #And the user drags and drops the Vitals thumbnail right by 45 and down by 400
    #And user clicks "Trend View" on the workspace editor of Vitals
    #And user clicks "Done" on the workspace editor
	#And the user is viewing the workspace titled "testTiles Workspace"

#@US4383 @US4384 @US4437 @US4513 @F352-1.1 @F352-1.2 @F352-1.3 @F352-1.4 @F352-1.5 @F352-1.6 @F352-2.1 @F352-2.2 @F352-2.3 @F352-3.1 @F352-4.1 @F352-5.1 @debug
#Scenario: Change, save and verify the tile sort order on the Conditions applet using a mouse
 #   Given the user is viewing the workspace titled "testTiles Workspace"
#	And the user is viewing the applet titled "Conditions"
#	And the first column title says "Problem"
#	And the list of conditions in the applet is as follows:
#	    | vist for: daycare exam    |
#	    | hand joint pain (finding)  |
#	    | shocklike sensation from left elbow to hand |
#	    | bone pain (finding)        |
	#    | swelling of limb (finding) |
	 #   | pain in limb (finding)     |
	  #  | foot pain (finding)   |
	    #| neck pain (finding)   |
	    #| sinus pressure       |
	    #| ankle pain (finding)  |
	    #| pain of nose (finding)|
	   # | malignant neoplasm of gastrointestinal tract (disorder) |
	  #  | aneurysm of gastrointestinal artery                     |
	 #   | gastrointestinal symptom (finding)                       |
	#    | examination of digestive system (procedure)             |
	#    | cough variant asthma (disorder)                         |
    #When the user clicks-and-holds on a tile with the title "shocklike sensation from left elbow to hand"
	#And the user observes the tile is hovering
	#And the user observes a blue line marks a location of where the tile can be dropped
	#And the user drags the mouse so the tile with the title "shocklike sensation from left elbow to hand" is hovering at the top of the condition list
	#And the user observes the blue line moves with mouse movement
	#And the user releases the mouse to drop the tile with the title "shocklike sensation from left elbow to hand" at the top of the condition list
    #Then the column title "Problem" changes to "Problem Manual Sort"
	#And a button appears next to the column title "Problem Manual Sort" with a tag containing the text "Clear manual sort order"
    #When the user clicks on the column title "Last"
	#And the applet sort order is by Last
	#And the user clicks on the column title "Problem"
    #Then the applet is sorted by Problem Manual Sort
	#And the column title is "Problem Manual Sort"
	#And the "pickaconditionhere" tile appears at the top of the list
    #When the user clicks on the column title "Problem Manual Sort"
    #Then the column title is updated to "Problem"
	#And the list of conditions in the applet is as follows:
	#|(show array of problems listed in the applet for this patient - ascending order by name)|
    #When the user clicks on the column title "Problem"
    #Then the list of conditions in the applet is as follows:
	#|(show array of problems listed in the applet for this patient - descending order by name)|
    #When the user clicks on the column title "Problem"
    #Then the column title is updated to say "Problem Manual Sort"
	#And the list of conditions in the applet is as follows:
	#|(show array of problems listed in the applet for this patient sorted manually)|
    #When the user clicks-and-holds on a tile with the title "pickasecondconditionhere"
	#And the user observes the tile is hovering
	#And the user observes a blue line marks a location of where the tile can be dropped
	#And the user drags the mouse so the tile with the title "pickasecondconditionhere" is hovering in the 5th position of the condition list
	#And the user observes the blue line moves with mouse movement
	#And the user releases the mouse to drop the tile with the title "pickasecondconditionhere" at the top of the condition list
    #Then the manual sort order is as follows:
	#|(show array of problems listed in the applet for this patient sorted manually)|


@F352-1.7 @debug 
Scenario: User cannot drag tiles across applets
Given the user is viewing the workspace titled "testTiles Workspace"
	And the user is viewing the applet titled "Conditions"
	And the list of conditions in the applet is as follows
	    | vist for: daycare exam    |
	    | hand joint pain (finding)  |
	    | shocklike sensation from left elbow to hand |
	    | bone pain (finding)        |
	    | swelling of limb (finding) |
	    | pain in limb (finding)     |
	    | foot pain (finding)   |
	    | neck pain (finding)   |
	    | sinus pressure       |
	    | ankle pain (finding)  |
	    | pain of nose (finding)|
	    | malignant neoplasm of gastrointestinal tract (disorder) |
	    | aneurysm of gastrointestinal artery                     |
	    | gastrointestinal symptom (finding)                       |
	    | examination of digestive system (procedure)             |
        | cough variant asthma (disorder)                         |
    When the user clicks-and-holds on a tile with the title "hand joint pain (finding)"
	And the user drags the tile across the workspace to the applet titled "Vitals"
    Then the tile drops in place on the applet titled "Conditions"


#Mouse ops:
#Select and drag tile to top of list
#Column title changes to say 'manual'
#Can sort by other column then return to manual tile sort order

#Negative Scenarios:
#unable to pick more than one tile at a time
#sort doesn't save when tile moved into position other than 0+n where n is number of tiles indexed
#view overview page and attempt to drag tile on conditions applet fails, attempt to drag tile on vitals applet fails, attempt to drag tile on meds fails, attempt to #drag tile on labs fails
#tile sorting on conditions applet saves and is not applied to Overview workspace, same with other 3 applets

#@F352
#Scenario: Change, save and verify the tile sort order on the Medications applet
 # Given the user is viewing the workspace titled "testTiles Workspace"
  #And the user is viewing the applet titled "Medications"
  #And the list of conditions in the applet is as follows

#Scenario: Change, save and verify the tile sort order on the Vitals applet
#Given
#When
#Then

#Scenario: Change, save and verify the tile sort order on the Labs applet
#Given
#When
#Then

#Scenario: Verify saved sort order for Conditions applies to all patients when viewing the workspace
#Given
#When
#Then

#Scenario: Change, save and verify the tile sort order on the Conditions applet using the keyboard fo 508 compliance
#Given
#When
#Then
#Tab to applet, hit enter on tile, select the tile move menu icon, use up arrow to move to top of list, hit enter to 'drop' tile and save new sort - for all 4 domains
 #  When the user tabs through the applet to the first quick view menu item on the third tile 
  # And the user hits enter on the quick view menu item titled "rearrange"
   #And the user hits the enter key on the menu item titled "rearrange"
   #And the user hits the down arrow "3" times
  # And the user hits enter key
   #Then the tile is moved into the 6th position in the list


#Encounters ? (doesn't seem to make sense)

#Do we apply the quick menu to all these domains? In other words, replace the link to the detail view to use the quick menu instead? 
