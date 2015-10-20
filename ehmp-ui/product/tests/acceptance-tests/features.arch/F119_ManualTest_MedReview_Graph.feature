@F119_MedReviewApplet_graph @manual @future
Feature: Feature F144: eHMP Viewer GUI.  MedReview applet graph display - Manual test case
# This test is being moved to archive.
# MedReview was updated in PSI 7, sprint C by US5421 and this test is OBE

@f119_1_medReveiwGraphDisplay @manual	  
Scenario: Verify MedReview applet displays all of the medications for a given patient in a graphical form

  Given user is logged in and viewing patient "Zzzretiredonenineteen,Patient"
  When the user clicks on link MedReview
  Then the MedReview page displays with List View and Timeline view
  Then the user clicks on TimeLine view
  Then the user selects All from global date picker
  And the medications for that patient are listed in the y axis
  And the month and year are displayed in the x axis
  And the legend says order, fill and expired
  And the medications in inpatient, outpatient etc categories are grouped together
  And for medication CIMITIDINE TAB Order history in blue bar shows from 9/1/1999 to 1/20/2000
  And Fill history in green bar shows from 9/1/1999 to 10/1/1999
  And the expired shows as black dot at 1/20/2000
  
@f119_2_medReveiwGraphDisplay @manual	  
Scenario: Verify MedReview applet displays all of the medications for a given patient in a graphical form

  Given user is logged in and viewing patient "Graphingpatient,Two"
  When the user clicks on link MedReview
  Then the MedReview page displays with List View and Timeline view
  Then the user clicks on TimeLine view
  Then the user selects All from global date picker
  And the medications for that patient are listed in the y axis
  And the month and year are displaed in the x axis
  And the legend says order fill and expired
  And the medications in inpatient, outpatient etc categories are grouped together
  And for medication terazosin cap,oral Order history shows as blue bar from 9/18/2006 to 9/19/2007
  And for medication terazosin cap,oral Order history shows as blue bar from 2/16/2007 to 2/17/2008
  And for medication terazosin cap,oral Order history shows as blue bar from 10/03/2007 to 10/03/2008
  And Fill history shows as green bar from 9/18/2006 to 12/18/2006
  And Fill history shows as green bar from 2/16/2007 to 05/16/2007
  And Fill history shows as green bar from 10/03/2007 to 01/03/2008
