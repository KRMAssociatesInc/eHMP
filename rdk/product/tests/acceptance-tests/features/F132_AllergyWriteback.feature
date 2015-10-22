@AllergyAdd_EIE @US2283 @F132 @future

Feature: F132 - Allergies (write-back)

@AllergyAdd @US2283
Scenario: Creating and Marking an adverse reaction as entered in error.
  Given a patient with pid "10114V651499" has been synced through the RDK API
  When the client saves an allergy for patient "10114V651499" with content "{"param": {"localId":"271","allergyName":"BEE STINGS^600;GMRD(120.82,","natureOfReaction":"Allergy","fileIEN":"10000000224","symptoms":[{"IEN":"476","Name":"A+FIB-FLUTTER\t<ATRIAL+FIBRILLATION-FLUTTER>","dateTime":""}],"eventDateTime":"20140925120300","historicalOrObserved":"h^HISTORICAL","cmtText":""}}"
  # other example: "{"param": {"localId":"204","allergyName":"DUST^14;GMRD(120.82,","natureOfReaction":"Allergy","fileIEN":"10000000224","symptoms":[{"IEN":"19","Name":"RESPIRATORY+DISTRESS","dateTime":"null"}],"eventDateTime":"20140930143800","historicalOrObserved":"h^HISTORICAL","cmtText":""}}"
  Then a successful response is returned
  Then wait 3 seconds
  When the client requests allergies for the patient "10114V651499" in RDK format
  Then a successful response is returned
  Then the VPR result has a uid
    |field          |value            |
    |summary        |BEE STINGS       |
    |facilityName   |CAMP MASTER      |
    |removed        |IS_NOT_SET       |

  When the client marks the saved allergy as Entered in Error for patient "10114V651499" with comment "comment"
  Then a successful response is returned
  Then the response includes a document id for the Entered in Error note
  Then wait 3 seconds

  Given a patient with pid "10114V651499" has been synced through the RDK API
  When the client requests allergies for the patient "10114V651499" in RDK format
  Then a successful response is returned
  Then the VPR results contain
    |field          |value        |
    |summary        |BEE STINGS   |
    |facilityName   |CAMP MASTER  |
    |removed        |true         |

  #### Unsigned notes for allergies entered in error are not stored in the VX Cache
  # When the client requests documents for the patient "10114V651499" in RDK format
  # Then a successful response is returned
  # Then the VPR results contain a document with the returned id
