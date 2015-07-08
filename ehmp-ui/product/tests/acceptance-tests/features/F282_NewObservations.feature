@US2971  @NewObservations

@New_Observations  @US2971  @onc
Feature: Wireframe to Create sidebar menu for New Observations
@US2972
Scenario: Wireframe to Create sidebar menu for New Observations and should be able to clik on Active Problem  and close 
   Given user is logged into eHMP-UI
   And user searches for and selects "Eight,Patient"
   And the user clicks the new observation
   And the user click the new Active Problem 
   Then the user click on Cancel 
  # And the user clicks the new observation
  # And the user click the Vitals
  # Then the user click on Cancel 
  # And the user clicks the new observation
  # And the user click the Allergy 
  # Then the user click on Close
