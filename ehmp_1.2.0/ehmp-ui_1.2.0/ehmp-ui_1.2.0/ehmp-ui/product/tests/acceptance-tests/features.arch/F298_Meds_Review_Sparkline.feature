@F298_Meds_Review_Sparkline

Feature: F298 : Meds Review Sparkline

#POC: Team Pluto

Background:
    Given user is logged into eHMP-UI

#@F298-3.1 @US4057
@future
Scenario: Viweing Meds review container - assuming the user has logged in and clicked on "Meds Review"
Given the meds review screen active
Then the combined view is displayed
And the list of meds will display correctly
And the list and graph will be side by side

#@F298-3.2 @US4057
@future
Scenario: Viweing outpatient meds - assuming the user has logged in, has selected an out-patient, and the out-patient has meds in the following groups: out-patient, in-patient, non-va, clinic, supplies
Given the med review screen is active
Then the out-patient meds group list displays on top
And the group order is out-patient, non-va, clinical, supplies, in-patient
And the out-patient is expanded
And the other groups are collapsed

#@F298-4.3 @US4057
@future
Scenario: Viweing inpatient meds - assuming the user has logged in, has selected an in-patient, and the in-patient has meds in the following groups: out-patient, in-patient, non-va, clinic, supplies
Given the med review screen is active
Then the out-patient meds group list displays on top
And the group order is out-patient, non-va, clinical, supplies, in-patient
And the in-patient is expanded
And the other groups are collapsed

#@F298-4.1 @US4176
@future
Scenario: In-patient meds days displays the last 72 hours on graph
Given the med review screen is active
Then the in-patient meds group list display is expanded
Then the meds graph deisplays the last 72 hours of data
And the administered doses for the last 72 hours  are represented by blue boxes

#@F298-4.2 @US4176
@future
Scenario: In-patient meds days displays the last 72 hours and only 48 hours of data fromt he last 72 hours
Given the med review screen is active
Then the in-patient meds group list display is expanded
Then the meds graph deisplays the last 72 hours of data
And the user chooses to display only the last 48 hours of data
Then 48 hours of data is displayed ont he graph
And there is no display for previous dates

#@F298-4.4 @US4176
@future
Scenario: In-patient missing administered data for scheduled medication
Given the med review screen is active
Then the in-patient meds group list display is expanded
Then the meds graph deisplays the last 72 hours of data
And the there are clear boxes in the graph to represent missing data

#@F298-4.5 @US4176
@future
Scenario: In-patient meds half-day view 72 hours of administered data
Given the med review screen is active
Then the in-patient meds group list display is expanded
And the current date and time are midday after a patient has been receiving medicaiton for over 72 hours
And only half a day's medications are displayed in the graph


#@F298-4.6 @US4176
@future
Scenario: In-patient with over 72 hours of administered and dosage held then restarted
Given the med review screen is active
Then the in-patient meds group list display is expanded
And the patient has been receiving meds for at least 72 hours
Then the dosage was held and restarted
Then the graph will display the hold period, dosage areas with no administered data, and administered again once the held is removed


#@F298-3.1.1 @US4178
@future
Scenario: Out-patient meds days supply graph display
Given the med review screen is active
Then the out-patient meds group list display is expanded
And the meds graph displays bars representing days

#@F298-3.3.1 @US4178
@future
Scenario: Out-patient active med graph expiring in three days or less is a high level notification
Given the med review screen is active
Then the out-patient meds group list display is expanded
And the patient has a medication that will expire in three days or less
Then a red box will be displayed warning the user that the medication will expire in three days or less

#@F298-3.4.1 @US4178
@future
Scenario: Out-patient active meds fill display expiring in three months is a medium level notification
Given the med review screen is active
Then the out-patient meds group list display is expanded
And the patient has a medication that will expire in three days or less
Then a box will be displayed warning the user that the medication will expire in 3 months

#@F298-3.5.1 @US4178
@future
Scenario: Out-patient active med prescription period or expiration line
Given the med review screen is active
Then the out-patient meds group list display is expanded
Then the days supply graph will show a blue bar for the entire duration of the prescription.

@F298-3.6.1 @US4178 @debug @DE813
Scenario: Out-patient active med prescription displays the gaps in filling
Given the med review screen is active
Then the out-patient meds group list display is expanded
Then the days supply graph displays gaps (white spaces) for when the patient has not filled the prescription before the days supply has run out

#@F298-3.7.1 @US4178
@future
Scenario: Out-patient active med prescription overlap in filling
Given the med review screen is active
Then the out-patient meds group list display is expanded
Then the days supply graph displays overlaps (dark blue spaces) for when the patient has not filled the prescription prior to prescription expiration

#@F298-3.8.1 @US4178
@future
Scenario: Out-patient active med prescription days supply exceeds expiration
Given the med review screen is active
Then the out-patient meds group list display is expanded
Then the days supply graph displays expired data (red spaces) for when the patient medication has expired

#@F298-3.9.1 @US4178
@future
Scenario: Out-patient discontinued med and the days supply exceeds discontinued date
Given the med review screen is active
Then the out-patient meds group list display is expanded
Then the days supply graph discontinued  (orange spaces) for when the patient medication has been put on hold or discontinued