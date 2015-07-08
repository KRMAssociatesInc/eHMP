@F298_Meds_Review_Sparkline
Feature: select Meds Review

   In order to view the Meds Review applet
   As a clinician
   I want to be able to select the Meds Review from drop-down list


   Background:
     Given I have a browser available
     And I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
     Then I can see the landing page



#  @ Meds review screen
  Scenario: User views Meds Review container
     Given The user confirms to "Eight,Patient" meds review
#    Given User navigates to Meds Review screen as "Eight,Patient"
     When user selects the meds review from the drop-down list
     Then  clinician is able to see the combined view
#    And   the list of medicines displays correctly
#    And   the list and graph displays side by side

