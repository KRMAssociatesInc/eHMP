@F280_VitalsGist @regression

Feature: F280 - Vitals Applet
#"As an eHMP  user, I need to view a complete operation gist view to include the Vitals domain that displays all defined panels and data; so that I can access Vitals information for a given patient."

#POC: Team Venus
@F280_1_vitalsGist_View @vimm @US4259 
Scenario: Verify vitals for patient using Overview Sheet
  Given user is logged into eHMP-UI
  And user searches for and selects "Ten,Patient"
  Then Overview is active
  And the user has selected All within the global date picker
  Then the "Vitals" applet is finished loading
  And user sees Vitals Gist
  Then the Vitals gist contains the data
  | name   | result          |
  | BPS    | 151 mm[Hg]      |
  | BPD    | 74 mm[Hg]       |
  | Pulse  | 94 /min         |
  | RR     | 14 /min         |
  | Temp   | 98.7 F 37.1 C   |
  | SpO2   | 99 %            |
  | Pain   | 2               |
  | Wt     | 157 lb 71.36 kg |
  | Ht     | 71 in 180.34 cm |
  | BMI    | 21.9            |



@F280_2_vitalsGist_View @base @US4259
Scenario: Verfy vitals for patient using Overview Sheet
  Given user is logged into eHMP-UI
  And user searches for and selects "Five,Patient"
  Then Overview is active
  And the user has selected All within the global date picker
  Then the "Vitals" applet is finished loading
  And user sees Vitals Gist
  Then the Vitals gist contains the data
  | name   | result          |
  | BPS    | 112 mm[Hg]      |
  | BPD    | 81 mm[Hg]       |
  | Pulse  | 94 /min         |
  | RR     | 15 /min         |
  | Temp   | 98.7 F 37.1 C   |
  | SpO2   | 98 %            |
  | Pain   | 1               |
  | Wt     | 174 lb 79.09 kg |
  | Ht     | 71 in 180.34 cm |
  | BMI    | 24.3            |

