@f128_ProblemList @onc @debug

Feature: F128 - Problem List (write-back)

#Create an RDK resource to read cache data for end points requires

@US1892_Problem_List_Writeback_failure
Scenario: Problem write back (add) from postman
    When the client puts data "100022^Zzzretiredonenineteen,Patient^0008^|10000000224|500|GMPFLD(.01)="9779^784.0"|GMPFLD(.03)="0^"|GMPFLD(.05)="ATOZ^YourKeyWordToCheckFor Chronic headache disorder"|GMPFLD(.08)="3141001^Oct 01 2014"|GMPFLD(.12)="A^ACTIVE"|GMPFLD(.13)="^"|GMPFLD(1.01)="8109405^Chronic headache disorder"|GMPFLD(1.02)="P"|GMPFLD(1.03)="10000000224^LORD,BRIAN"|GMPFLD(1.04)="10000000224^LORD,BRIAN"|GMPFLD(1.05)="10000000224^Lord,Brian"|GMPFLD(1.09)="3141001^Oct 01 2014"|GMPFLD(1.14)="C^CHRONIC"" using Postman
    Then the 500 response is returned

@US1892_Problem_List_Writeback_success
Scenario: Problem write back (add) from postman
    When the client puts data "No|20141001|20141001|USER,PANORAMA|10000000226|No||100615|Zzzretiredonenineteen,PATIENT|Bad headache|Real headache|10000000226|USER,PANORAMA|USER,PANORAMA|10000000226|64^AUDIOLOGY|A^ACTIVE|10000000226" using Postman
    Then the successful response is returned

@US2679_Problem_List_Search
Scenario: Client can search for problems in VPR format from RDK API
    When the client searches for problems with search criteria "headache" in VPR format from RDK API
    Then the successful response is returned
    And the VPR result contains more than 0 records
    And the problemText field starts with search character "headache"

@US2645_Problem_List_Update_500
Scenario:Add RDK component to update existing Problem
    When the client posts data "499|10000000224|500|12474^410.90|20141001|^Hello World!!!!!Acute myocardial infarction, unspecified site, episode of care unspecified|20050303|I^INACTIVE" using postman
    Then the 500 response is returned

@US2645_Problem_List_Update
Scenario:Add RDK component to update existing Problem
    When the client posts data "10000000060|10000000060|PROVIDER,ONEHUNDREDFORTYSEVEN|10000000226|A^ACTIVE|Other ill-defined heart diseases|Other ill-defined heart diseases|499|20141018|20141018|USER,PANORAMA|A^ACUTE|No|64^AUDIOLOGY" using postman
    Then the successful response is returned
    Then the response is "{"response":"Success"}"

 @US2887_Problem_List_Remove @debug
 Scenario: Add RDK component to remove existing Problem
    When the client runs data "499|10000000030" using postman
    Then the successful response is returned
    Then the response is "{"response":"Success"}"
    #When the client queries JDS
    #Then the results contain removed with the written value "true"
    When the client checks in Vista
    Then the results will have Condition HIDDEN
