@TileSorting @F352 

Feature: F352 - Tile Sorting

@F352_save_tile_sort @US4384 @debug
Scenario: Save information for the index of items in an applet 
When the client requests to delete an applet in workspace "TEST1" with instanceId "1234" and content "{"instanceId":1234,"keyField":"Key3","orderAfter":"v1","fieldValue":"v2"}"
And the response is "{}"
And the client requests to view an applet in workspace "TEST1" with instanceId "1234" and content "{"instanceId":1234,"keyField":"Key3","orderAfter":"v1","fieldValue":"v2"}"
Then a successful response is returned
And the response is "{}"
When the client sorts a tile for workspace "TEST1" with the content "{"instanceId":1234,"keyField":"Key3","orderAfter":"v2","fieldValue":"v1"}"
Then a successful response is returned
And the results contain
      | name                  | value               |
      | _id                   | CONTAINS TEST1_sort |
      | applets.instanceId    | 1234                |
      | applets.keyField      | Key3                |
      | applets.orderSequence | v1                  |
When the client sorts a tile for workspace "TEST1" with the content "{"instanceId":1234,"keyField":"Key3","orderAfter":"v1","fieldValue":"v2"}"
Then a successful response is returned
And the results contain
      | name                  | value               |
      | _id                   | CONTAINS TEST1_sort |
      | applets.instanceId    | 1234                |
      | applets.keyField      | Key3                |
      | applets.orderSequence | CONTAINS v1         |
      | applets.orderSequence | CONTAINS v2         |
      | applets.orderSequence | IN_ORDER v1,v2      |
When the client requests to delete an applet in workspace "TEST1" with instanceId "1234" and content "{"instanceId":1234,"keyField":"Key3","orderAfter":"v1","fieldValue":"v2"}"
Then a successful response is returned
When the client requests to view an applet in workspace "TEST1" with instanceId "1234" and content "{"instanceId":1234,"keyField":"Key3","orderAfter":"v1","fieldValue":"v2"}"
Then a successful response is returned
And the response is "{}"
