@future
Feature: F149 - Auto logoff - Manual and Automated test cases.
This feature will track the amount of time a user is logged-in to Ehmp, but is inactive. At the 12 minute mark, it will present a modal pop-up to the user, warning the user that they will be automatically logged-off in 3 mintues. The warning will be repeated at the 13 and 14 minute marks, wanring the user that they will be autoamtically logged-off in two minutes then in one minute. At the 15 minute mark, the user will be automatically logged-off.

# This test is being moved to archive.
# Manual test is defined in functional test ehmp_UAT_4.2

@US2717_Manual_1 @manual
Scenario: User is logged into eHMP-UI in the browser and an auto logoff warning popup is displayed. The user chooses to ignore the first by clicking the x at the top right of the popup to close it. Then a second popup appears. The user then clicks the continue button to reset the timer. The popup is again displayed. Then the user clicks the logout button to logout immediately.
    Given user is logged into eHMP-UI and is inactive
    Given a popup is displayed after 12 minutes of inactivity warning the user they will be automatically logged off in 3 minutes
    Then the user chooses to ignore the popup by clocking on the x at the top right of the  popup to close it
    Then the popup is displayed again warning the user they will be automatically logged off in 2 minutes
    Then the user chooses to reset the timer by clicking "continue" on the popup
    Then after 13 more minutes of inactivity, the popup is again displayed warning the user that they will be automatically logged off in 3 minutes.
    Then the user chooses to logout immediately by clicking the "logout" button on the popup
    Then the user is logged off and the login screen is displayed.

@US2717_Manual_2 @manual
Scenario: User is logged into eHMP-UI in the browser and an auto logoff warning popup is displayed. The user remains inactive and receives two more warnings before finally being logged off
    Given user is logged into eHMP-UI in the browser
    Given a popup is displayed after 12 minutes of inactivity warning the user they will be automatically logged off in 3 minutes
    Then the user remains inactive
    Then the popup is displayed again warning the user they will be automatically logged off in 2 minutes
    Then the user remains inactive
    Then the popup is displayed again warning the user they will be automatically logged off in 1 minute
    Then the user remains inactive
    Then the user is logged off and the login screen is displayed.

@US2717_automated_1 @future
Scenario: User is logged into eHMP-UI in the browser and an auto logoff warning popup is displayed. The user chooses to ignore the first one and clicks the x at the top right of the popup to close it. Then a second popup appears. The user then clicks the continue button to reset the timer. The popup is again displayed. Then the user clicks the logout button to logout immediately.
    Given user is logged into eHMP-UI in the browser
    Given a popup is displayed warning the user they will be automatically logged off
    Then the user chooses to "continue"
    Given a popup is displayed warning the user they will be automatically logged off
    Then the user chooses to "logout"

@US2717_automated_2 @future
Scenario: User is logged into eHMP-UI in the browser and an auto logoff warning popup is displayed and user chooses to ignore the warnings until automatically logged off
    Given user is logged into eHMP-UI
    Given a popup is displayed warning the user they will be automatically logged off
    Then the user chooses to "close"
    Given a popup is displayed warning the user they will be automatically logged off
    Then the user chooses to "ignore"
    Then the user is automatically logged off