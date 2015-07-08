@F130_MedicationData @F130 @onc

Feature: F130 Non-VA Medications (write-back)

@US1962_MedicationWriteBack @US1962 @onc
	Scenario: Medication write back (save and discontinue)
	When the client adds a non-VA medication for patient "10114V651499" with the content "{"param":{"ien":100033,"provider":10000000225,"location":11,"orderDialog":"PSH OERR","displayGroup":48,"quickOrderDialog":389,"ORDIALOG":{"medIEN":3876,"strength":"","drugIEN":639,"doseString":"&&&&2 TABLETS&5570&&","dose":"2 TABLETS","routeIEN":1,"schedule":"TWICE A DAY","instructions":"TAKE 2 TABLETS BY MOUTH TWICE A DAY ","comment":"comment","definedComments":["Non-VA medication recommended by VA provider.","Patient wants to buy from Non-VA pharmacy."],"ORCHECK":0,"ORTS":9,"date":"20150105"}}}"
	Then a successful response is returned
	And the response contains ""success":true"
  # /resource/writeback/medication/save/discontinue?param={"ien":"10000000225","locien":"64","orderien":"18068;1","reason":"7"}&pid=10114V651499
  Then the new Non-VA Med order can be discontinued for patient "10114V651499" with reason "7", location IEN "64" and provider IEN "10000000225"
  And the response contains ""success":true"
