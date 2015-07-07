@DeleteWorkspaceContent @F353

Feature: F353 - Delete Workspace Content

@F353_delete_workspace_content @US5433 @F353-9.2
Scenario: Create workspace, add an applet and filter. Then delete workspace and verify applet/filter do not persist.
Delete the same workspace again and verify that applet/filter do not persist.

When the client deletes a workspace for patient id "10108V420871" and with content "{"screenType":"user-defined-workspace-1","param":{}}"
Then a successful response is returned
And the results contain
      | name                  | value     |
      | graphs                | {}        |
      | workspace             | {}        |
      | filters               | {}        |
      | sorts                 | {}        |
When the client requests to create a workspace for patient id "10108V420871" with content "{"screenType":"UserScreensConfig","param":{"screens":[{"description":"","id":"cover-sheet","predefined":true,"routeName":"cover-sheet","title":"Coversheet"},{"description":"","id":"news-feed","predefined":true,"routeName":"news-feed","title":"Timeline"},{"defaultScreen":true,"description":"","id":"overview","predefined":true,"routeName":"overview","title":"Overview"},{"description":"","id":"medication-review","predefined":true,"routeName":"medication-review","title":"Meds Review"},{"description":"","id":"documents","predefined":true,"routeName":"documents-list","title":"Documents"},{"id":"user-defined-workspace-1","routeName":"user-defined-workspace-1","title":"User Defined Workspace 1","defaultScreen":false,"author":"PANORAMA USER","fileName":"NewUserScreen"}]}}"
Then a successful response is returned
When the client requests to add an applet for patient id "10108V420871" with content "{"screenType":"user-defined-workspace-1","param":{"id":"user-defined-workspace-1","contentRegionLayout":"gridster","appletHeader":"navigation","appLeft":"patientInfo","userDefinedScreen":true,"applets":[{"id":"allergy_grid","title":"Allergies","maximizeScreen":"allergy-grid-full","showInUDWSelection":true,"instanceId":"applet-1","region":"applet-1","dataRow":"1","dataCol":"2","dataSizeX":"8","dataSizeY":"6","dataMinSizeX":"4","dataMinSizeY":"3","dataMaxSizeX":"8","dataMaxSizeY":"12","viewType":"expanded"}]}}"
Then a successful response is returned
When the client requests to add a filter "CHOCOLATE" to an applet in workspace "user-defined-workspace-1" with instanceId "applet-1"
Then a successful response is returned
And the results contain
      | name                                          | value                             |
      | _id                                           | CONTAINS user-defined-workspace-1 |
      | userdefinedfilters.applets.instanceId         | applet-1                          |
      | userdefinedfilters.applets.filters            | CHOCOLATE                         |
When the client deletes a workspace for patient id "10108V420871" and with content "{"screenType":"user-defined-workspace-1","param":{}}"
Then a successful response is returned
And the results contain
      | name                  | value     |
      | graphs                | {}        |
      | workspace             | {}        |
      | filters               | {}        |
      | sorts                 | {}        |
When the client requests to view an applet from workspace "user-defined-workspace-1" with instanceId "applet-1"
Then a successful response is returned
And the response is "{}"
When the client requests to create a workspace for patient id "10108V420871" with content "{"screenType":"UserScreensConfig","param":{"screens":[{"description":"","id":"cover-sheet","predefined":true,"routeName":"cover-sheet","title":"Coversheet"},{"description":"","id":"news-feed","predefined":true,"routeName":"news-feed","title":"Timeline"},{"defaultScreen":true,"description":"","id":"overview","predefined":true,"routeName":"overview","title":"Overview"},{"description":"","id":"medication-review","predefined":true,"routeName":"medication-review","title":"Meds Review"},{"description":"","id":"documents","predefined":true,"routeName":"documents-list","title":"Documents"},{"id":"user-defined-workspace-1","routeName":"user-defined-workspace-1","title":"User Defined Workspace 1","defaultScreen":false,"author":"PANORAMA USER","fileName":"NewUserScreen"}]}}"
Then a successful response is returned
When the client requests to view an applet from workspace "user-defined-workspace-1" with instanceId ""
Then a successful response is returned
And the response is "{}"
