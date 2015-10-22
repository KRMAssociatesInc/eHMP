@F239_User_Defined_Applet_Filter @future

Feature: F239 – User-Defined Applet Filters

@F239_save_a_user_defined_filter @US4381 @F239-1.1
Scenario: Adding a user defined filter 
  When the client saves a UDAF with test "TEST1" filter "filter1" and instance "1234" in a workspace
  Then a successful response is returned
  When the client requests to see udaf with same parameters "TEST1" filter "filter1" and instanceId "1234" in a workspace
  Then a successful response is returned
  And the results contain
      | name                               | value                  |
      | _id                                | CONTAINS TEST1_filter  |
      | userdefinedfilters.applets.filters | filter1                |
  When the client requests to delete udaf with same parameters "TEST1" filter "filter1" and instanceId "1234" in a workspace
  Then a successful response is returned
  When the client requests to see udaf with same parameters "TEST1" filter "filter1" and instanceId "1234" in a workspace
  Then a successful response is returned
  And the response is "{}"

@F239_remove_all_user_defined_filters @US5507 @F239-2.1
Scenario: Removing all user defined filters 
  When the client saves a UDAF with test "TEST1" filter "filter1" and instance "1234" in a workspace
  Then a successful response is returned
  When the client requests to see udaf with same parameters "TEST1" filter "filter1" and instanceId "1234" in a workspace
  Then a successful response is returned
  And the results contain
      | name                               | value                  |
      | _id                                | CONTAINS TEST1_filter  |
      | userdefinedfilters.applets.filters | CONTAINS filter1                |
  When the client saves a UDAF with test "TEST1" filter "filter2" and instance "1234" in a workspace
  Then a successful response is returned
  When the client requests to see udaf with same parameters "TEST1" filter "filter1" and instanceId "1234" in a workspace
  Then a successful response is returned
  And the results contain
      | name                               | value                  |
      | _id                                | CONTAINS TEST1_filter  |
      | userdefinedfilters.applets.filters | CONTAINS filter2                |    
  When the client requests to delete all udafs for workspace "TEST1" and appletId "1234" for a user
  Then a successful response is returned
  When the client requests to see udaf with same parameters "TEST1" filter "filter1" and instanceId "1234" in a workspace
  Then a successful response is returned
  And the response is "{}"
  When the client requests to see udaf with same parameters "TEST1" filter "filter2" and instanceId "1234" in a workspace
  Then a successful response is returned
  And the response is "{}"
  