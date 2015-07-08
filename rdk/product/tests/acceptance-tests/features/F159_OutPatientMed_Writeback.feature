@F159_OutPatientMed @OBE @future

Feature: F159 CPOE - Outpatient Medications (ONC)
#Create RDK resource to set up write back to VistA order file 100 RPC - ORWDX SAVE

#Team Andromeda

  @F159_OutPatientMed_Writeback_1 @US3576 @OBE
  Scenario: Add a new OutPatientMed write back from postman.
  #Medication Name=ASPIRIN BUFFERED TAB, Dosage=325MG, Route=ORAL (BY MOUTH), Schedule=ONCE DAILY, Days Supply=90, Qty (TAB)=90, Refills=2
  #http://10.4.4.105:8888/writeback/opmed/save?pid=10108V420871
  #http://10.4.4.105:8888/writeback/opmed/save?pid=10108V420871&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
  When the client adds Outpatient Medication "{"param":{"ien":100013,"provider":10000000226,"location":23,"orderDialog":"PSO OERR","displayGroup":4,"quickOrderDialog":147,"orderID":"","ORDIALOG":{"medIEN":3854,"strength":"325MG","drugIEN":280,"doseString":"325&MG&1&TABLET&325MG&280&325&MG","dose":"325MG","routeIEN":1,"schedule":"EVERY DAY","supply":90,"quantity":90,"refills":2,"pickup":"W","priority":9,"instructions":"TAKE ONE TABLET BY MOUTH EVERY DAY","comment":"ASPIRIN BUFFERED for Shalini Test1","ORCHECK":0,"ORTS":0}}}" for the patient "11000V221996" and "path" in VPR format from RDK API
  Then a successful response is returned
  And the outpatient medication after Save response contains ""success":true"

  @F159_OutPatientMed_Writeback_2 @US3576 @OBE
  Scenario: Add a new OutPatientMed write back from postman.
  #Medication Name=SIMVASTATIN TAB, Dosage=20MG, Route=ORAL (BY MOUTH), Schedule=ONCE DAILY, Days Supply=30, Qty (TAB)=30, Refills=1
  #http://10.4.4.105:8888/writeback/opmed/save?pid=10108V420871
  #http://10.4.4.105:8888/writeback/opmed/save?pid=10108V420871&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
  When the client adds Outpatient Medication "{"param":{"ien":100013,"provider":10000000226,"location":23,"orderDialog":"PSO OERR","displayGroup":4,"quickOrderDialog":147,"orderID":"","ORDIALOG":{"medIEN":3500,"strength":"20MG","drugIEN":1713,"doseString":"20&MG&1&TABLET&20MG&1713&20&MG","dose":"20MG","routeIEN":1,"schedule":"EVERY DAY","supply":30,"quantity":30,"refills":1,"pickup":"W","priority":9,"instructions":"TAKE ONE TABLET BY MOUTH EVERY DAY","comment":"ONC Test Data 1 - Simvastatin","ORCHECK":0,"ORTS":0}}}" for the patient "11000V221996" and "path" in VPR format from RDK API
  Then a successful response is returned
  And the outpatient medication after Save response contains ""success":true"

  @F159_OutPatientMed_Writeback_3 @US3576 @OBE
  Scenario: Add a new OutPatientMed write back from postman.
  #Medication Name=WARFARIN TAB, Dosage=5MG, Route=ORAL (BY MOUTH), Schedule=MO-WE-FR, Days Supply=60, Qty (TAB)=60, Refills=0
  #http://10.4.4.105:8888/writeback/opmed/save?pid=10108V420871
  #http://10.4.4.105:8888/writeback/opmed/save?pid=10108V420871&accessCode=pu1234&verifyCode=pu1234!!&site=9E7A
  When the client adds Outpatient Medication "{"param":{"ien":100013,"provider":10000000226,"location":23,"orderDialog":"PSO OERR","displayGroup":4,"quickOrderDialog":147,"orderID":"","ORDIALOG":{"medIEN":2018,"strength":"5MG","drugIEN":1812,"doseString":"5&MG&1&TABLET&5MG&1812&5&MG","dose":"5MG","routeIEN":1,"schedule":"MO-WE-FR","supply":60,"quantity":60,"refills":0,"pickup":"W","priority":9,"instructions":"TAKE ONE TABLET BY MOUTH MO-WE-FR","comment":"ONC Test Data 7 - WARFARIN","ORCHECK":0,"ORTS":0}}}" for the patient "11000V221996" and "path" in VPR format from RDK API
  Then a successful response is returned
  And the outpatient medication after Save response contains ""success":true"
