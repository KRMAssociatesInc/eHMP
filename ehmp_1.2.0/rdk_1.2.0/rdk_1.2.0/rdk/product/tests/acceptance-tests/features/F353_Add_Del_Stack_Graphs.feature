@AddDelStackGraphs @F353

Feature: F353 - Add and Delete Stack Graphs

@F353_add_del_stack_graphs @US4578 @F353-2.1
Scenario: Create workspace and add a Stack Graph applet. Then add/ delete/ get multiple stack graphs. Duplicate graphs should not be saved.

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
When the client requests to add an applet for patient id "10108V420871" with content "{"screenType":"user-defined-workspace-1","param":{"id":"user-defined-workspace-1","contentRegionLayout":"gridster","appletHeader":"navigation","appLeft":"patientInfo","userDefinedScreen":true,"applets":[{"id":"stackedGraph","title":"Stacked Graphs","showInUDWSelection":true,"instanceId":"applet-1","region":"applet-1","dataRow":"1","dataCol":"1","dataSizeX":"8","dataSizeY":"6","dataMinSizeX":"4","dataMinSizeY":"3","dataMaxSizeX":"8","dataMaxSizeY":"12","viewType":"expanded"}]}}"
Then a successful response is returned

When the client requests to add a stack graph with graphType "vitals" and typeName "temperature" in workspace "user-defined-workspace-1" with instanceId "applet-1"
Then a successful response is returned
And the results contain
      | name                                          | value                                         |
      | _id                                           | CONTAINS user-defined-workspace-1_stacked     |
      | userdefinedgraphs.applets.instanceId          | applet-1                                      |
      | userdefinedgraphs.applets.graphs.graphType    | vitals                                        |
      | userdefinedgraphs.applets.graphs.typeName     | temperature                                   |

# try to add duplicate record
When the client requests to add a stack graph with graphType "vitals" and typeName "temperature" in workspace "user-defined-workspace-1" with instanceId "applet-1"
Then a successful response is returned
And the results contain
      | name                                          | value                                         |
      | _id                                           | CONTAINS user-defined-workspace-1_stacked     |
      | userdefinedgraphs.applets.instanceId          | applet-1                                      |
      | userdefinedgraphs.applets.graphs.graphType    | vitals                                        |
      | userdefinedgraphs.applets.graphs.typeName     | temperature                                   |

When the client requests to add a stack graph with graphType "vitals" and typeName "weight" in workspace "user-defined-workspace-1" with instanceId "applet-1"
Then a successful response is returned
And the results contain
      | name                                          | value                                         |
      | _id                                           | CONTAINS user-defined-workspace-1_stacked     |
      | userdefinedgraphs.applets.instanceId          | applet-1                                      |
      | userdefinedgraphs.applets.graphs.graphType    | vitals                                        |
      | userdefinedgraphs.applets.graphs.typeName     | temperature                                   |
      | userdefinedgraphs.applets.graphs.graphType    | vitals                                        |
      | userdefinedgraphs.applets.graphs.typeName     | weight                                        |

When the client requests to get stack graphs for workspace "user-defined-workspace-1" with instanceId "applet-1"
Then a successful response is returned
And the results contain
      | name                                          | value                                         |
      | _id                                           | CONTAINS user-defined-workspace-1_stacked     |
      | userdefinedgraphs.applets.instanceId          | applet-1                                      |
      | userdefinedgraphs.applets.graphs.graphType    | vitals                                        |
      | userdefinedgraphs.applets.graphs.typeName     | temperature                                   |
      | userdefinedgraphs.applets.graphs.graphType    | vitals                                        |
      | userdefinedgraphs.applets.graphs.typeName     | weight                                        |

When the client requests to delete a stack graph with graphType "vitals" and typeName "temperature" in workspace "user-defined-workspace-1" with instanceId "applet-1"
Then a successful response is returned
And the results contain
      | name                                          | value                                         |
      | _id                                           | CONTAINS user-defined-workspace-1_stacked     |
      | userdefinedgraphs.applets.instanceId          | applet-1                                      |
      | userdefinedgraphs.applets.graphs.graphType    | vitals                                        |
      | userdefinedgraphs.applets.graphs.typeName     | weight                                        |

When the client deletes a workspace for patient id "10108V420871" and with content "{"screenType":"user-defined-workspace-1","param":{}}"
Then a successful response is returned
And the results contain
      | name                  | value     |
      | graphs                | {}        |
      | workspace             | {}        |
      | filters               | {}        |
      | sorts                 | {}        |


@F353_del_stack_graph_applet @US6316 @F353-13.1 @F353-13.2 @F353-13.3
Scenario: Create workspace and add a Stack Graph applet. Then add a stack graph. Delete the applet and verify that stacked graphs do not persist. Delete the workspace as cleanup.

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
When the client requests to add an applet for patient id "10108V420871" with content "{"screenType":"user-defined-workspace-1","param":{"id":"user-defined-workspace-1","contentRegionLayout":"gridster","appletHeader":"navigation","appLeft":"patientInfo","userDefinedScreen":true,"applets":[{"id":"stackedGraph","title":"Stacked Graphs","showInUDWSelection":true,"instanceId":"applet-1","region":"applet-1","dataRow":"1","dataCol":"1","dataSizeX":"8","dataSizeY":"6","dataMinSizeX":"4","dataMinSizeY":"3","dataMaxSizeX":"8","dataMaxSizeY":"12","viewType":"expanded"}]}}"
Then a successful response is returned

When the client requests to add a stack graph with graphType "vitals" and typeName "temperature" in workspace "user-defined-workspace-1" with instanceId "applet-1"
Then a successful response is returned
And the results contain
      | name                                          | value                                         |
      | _id                                           | CONTAINS user-defined-workspace-1_stacked     |
      | userdefinedgraphs.applets.instanceId          | applet-1                                      |
      | userdefinedgraphs.applets.graphs.graphType    | vitals                                        |
      | userdefinedgraphs.applets.graphs.typeName     | temperature                                   |

When the client requests to delete the applet in workspace "user-defined-workspace-1" with instanceId "applet-1"
Then a successful response is returned
And the response is "{}"

When the client requests to get stack graphs for workspace "user-defined-workspace-1" with instanceId "applet-1"
Then a successful response is returned
And the response is "{}"

When the client deletes a workspace for patient id "10108V420871" and with content "{"screenType":"user-defined-workspace-1","param":{}}"
Then a successful response is returned
And the results contain
      | name                  | value     |
      | graphs                | {}        |
      | workspace             | {}        |
      | filters               | {}        |
      | sorts                 | {}        |
