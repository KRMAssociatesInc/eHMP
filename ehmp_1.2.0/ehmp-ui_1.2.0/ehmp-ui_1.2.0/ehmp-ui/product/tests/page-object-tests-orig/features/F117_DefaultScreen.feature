
@F117_defaultscreeen @debug @DE153

Feature: Test Main Background
In order to access EHMP-UI
As a user
I want to setup a browser and login

    Scenario:
        Given I have a browser available
        And I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
        Then I can see the landing page

