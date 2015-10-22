@F144_NewsFeedApplet_graph @manual @future

Feature: Feature F144: eHMP Viewer GUI. 
# This test is being moved to archive.
# Manual test is defined in functional test TC14
@f144_1_newsFeedGraphDisplay @manual	  
Scenario: Timeline applet displays all of the Visits for a given patient in a graphical form

  Given user is logged in and viewing patient "Zzzretiredonenineteen,Patient"
  When the user chooses Timeline from Coversheet dropdown menu
  Then the NewsFeed page title is "TIMELINE"
  And the number of visits in a given month for a patient are displayed as a graph at the top of the grid view
  And the month and year are recorded on the x-axis
  And number of events are recorded on the y-axis
  And May 1993 is the first visit and May 1996 is the last visit so far for the patient.
  And there are two events for May 1993
  And there is one event for January 1995
  And there are two events for December 1996
  And there is one event for May 1996
  When you filter on the text "TROY"
  Then the graph is filtered and shows only one event.
  And the table shows only one row
  When you zoom in to a date range 
  Then only the events in that date range are shown
  And the grid view updates with the above data
  When you use the global date filter
  Then only the events for the chosen date range are shown in the graph.
  And for 1yr range there shouldn't be any records shown
  
@US3709 @Timeline_header @manual

Scenario: The graph and header should be frozen in Timeline Applet

 Given user is logged in and viewing patient "Eight,Patient"
 When the user chooses Timeline from Coversheet dropdown menu
 Then the Timeline page title says "TIMELINE"
 And the graph and the table header with data are visible
 And the filter and refresh buttons are available to choose
 When the user changes the global date filter to All
 Then the data is refreshed with all records
 And user can scroll the table
 And the Timline header and graph are frozen
 And user can still see the graph and Timeline headers with the filters
  
  