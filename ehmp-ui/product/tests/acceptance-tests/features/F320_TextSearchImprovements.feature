@F320_TextSearchImprovements

Feature: F320 : TextSearchImprovements
#This feature will enhance the current text search engine used within eHMP to improve areas such as predications, synonyms, misspellings, duplicates, suggestions, as well as others.
#As an eHMP user, I need to be able to have a broad range of synonyms and acronyms returned when I enter queries into text search; so that I can have a more varied selection than what is currently available.

#POC: Team Venus
@F320_1_TextSearchImprovements @US5513
Scenario: Verfy text search returns value no result
  Given user is logged into eHMP-UI
  And user searches for and selects "Five,Patient"
  Then Overview is active
  Then user searches for "ionva" with no suggestion

@F320_2_TextSearchImprovements @US4538
Scenario: Verfy text search returns value duplicates
  Given user is logged into eHMP-UI
  And user searches for and selects "Five,Patient"
  Then Overview is active
  Then user searches for "chem" with no duplicates in the results dropdown

@F320_3_TextSearchImprovements @US4542
Scenario: The application needs to be able to highlight the same search terms when the details of the search results are displayed.
  Given user is logged into eHMP-UI
  And user searches for and selects "Four,Patient"
  Then Overview is active
  Then user searches for "chocolate"
  Then the user clicks one of the search result "Allergy/Adverse Reaction"
  Then the user clicks one of the search result "Chocolate"
  Then the modal is displayed
  And the modal's title is "Allergen - CHOCOLATE"
  Then the modal contains highlighted "CHOCOLAT"
  And the user clicks the modal "Close Button"
  And the modal is closed

@F320_4_TextSearchImprovements @US4542
Scenario: The application needs to be able to highlight the same search terms when the details of the search results are displayed.
  Given user is logged into eHMP-UI
  And user searches for and selects "Ten,Patient"
  Then Overview is active
  Then user searches for "allergy"
  Then the user clicks one of the search result "Progress Note"
  Then the user clicks one of the search result "Diabetes"
  Then the user clicks one of the search result "Allergies"
  Then the modal is displayed
  And the modal's title is "diabetes Details"
  Then the modal contains highlighted "ALLERGIES"
  And the user clicks the modal "Close Button"
  And the modal is closed

@F320_5_TextSearchImprovements @US5866
Scenario: Verify results for suggestions while searching for specific word
  Given user is logged into eHMP-UI
  And user searches for and selects "Seven,Patient"
  Then Overview is active
  Then user searches for "hiper" and verifies suggestions
  | Search for: "hiper" |
  | piper               |
  | hyper               |
  | viper               |
  | schipper            |
  | leper               |

@F320_6_TextSearchImprovements @US4543
Scenario: Verify Related terms, Drug classes and Predications relevant to the initail search term are display in the search results
  Given user is logged into eHMP-UI
  And user searches for and selects "Seven,Patient"
  Then Overview is active
  Then user searches for "aspirin" and verifies suggestions
  | Search for: "aspirin" |
  #Inferred Drug Class
  | non-opioid analgesics |
  | opioid analgesics     |
  #Inferred Drug Class
  | aspirinrast         |
  | aspiringiven        |
  | rectalaspirin       |
  | aspirinextract      |
  | aspirin+glycine     |
  | aspirinallergy      |
  | bufferedaspirin     |
  | containsaspirin     |
  | aluminumaspirin     |
  | aspirinoverdose     |
  | aspirinpoisoning    |
  | aspirin+ codeine    |
  | aspirinnot given    |
  | aspirinindicated    |
  | oral formaspirin    |
  | aspirin+ caffeine   |
  | already onaspirin   |
  | aspirin+papaveretum |
  | aspirinprophylaxis  |
  | aspirin+pravastatin |
  | aspirin75mg tablet  |
  | aspirinmeasurement  |

@F320_6_TextSearchImprovements @US4543
Scenario: Verify Related terms, Drug classes and Predications relevant to the initail search term are display in the search results
  Given user is logged into eHMP-UI
  And user searches for and selects "Ten,Patient"
  Then Overview is active
  Then user searches for "penicillin" and verifies suggestions
  | Search for: "penicillin" |
  #Therapeutic Drug Class
  | penicillins,amino derivatives |
  | penicillin-g related          |
  | penicillinase-resistant       |
  #Inferred Drug Class
  | iv solutions without electrolytes |
  | iv solutions with electrolytes    |
  #Snomed Terminology
  | penicillinv       |
  | penicilling       |
  | penicillinase     |
  | penicillinrast    |
  | penicilling rast  |
  | penicillinv rast  |
  | penicillinallergy |
  | naturalpenicillin |
  | penicillinamidase |

@F320_7_TextSearchImprovements @US5514
Scenario: User enters several queries known to have acceptable synonyms and variants.
  Given user is logged into eHMP-UI
  And user searches for and selects "Fortysix,Patient"
  Then Overview is active
  Then user searches for "bbb"
  Then the user clicks one of the search result "Progress Note"
  Then the user clicks one of the search result "Diabetes"
  Then the user clicks one of the search result "bundle branch block"
  Then the modal is displayed
  And the modal's title is "diabetes Details"
  Then the modal contains highlighted "bundle"
  And the user clicks the modal "Close Button"
  And the modal is closed
