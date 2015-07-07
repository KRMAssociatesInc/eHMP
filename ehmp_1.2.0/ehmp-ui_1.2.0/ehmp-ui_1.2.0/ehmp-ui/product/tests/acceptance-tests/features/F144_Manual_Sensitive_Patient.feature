@F144_Sensitive_Patient @manual @future
Feature: user selects sensitive patient

#POC: Team Mercury

# This needs to be a manual test because it can't pass in phantomjs, but it passes in chrome. "it is an issue with async calls in phantomJS where if they respond back with a error # code in the 400s  that phantomJS changes it to 0"
# https://github.com/ariya/phantomjs/issues/11195
@validsearch_1
Scenario: user test for access denied display
    And the User selects mysite and All
    And user enters full last name "ZZZRETIREDNINETYFOUR"
    And the user select patient name "ZZZRETIREDNINETYFOUR,PATIENT"
    And the user verifies unAuthorized "You are not authorized to view this record."