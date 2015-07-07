#####################################################################################################
# This code parses existing JSON files and creates a new patient record by replacing values         #
# for the patientIEN, allergy name and symptoms with values randonly generated using Forgery        #
# dictionaries                                                                                      #
#                                                                                                   #
# The patient record created will have the same number of symptoms as the original parsed JSON fil  #
# That is, parsing 100716_Allergy_20131205_1608.json will create two symptoms per allergy           #
# and parsing 100615_Allergy_88074354_9986.json will create one symmtom per allergy                 #
#                                                                                                   #
# The new patient record is written to panorama VistA Instance using RPC: ORWDAL32 SAVE ALLERGY     #
#                                                                                                   #
#####################################################################################################
require 'rubygems'
require 'vistarpc4r'
require 'forgery'
require 'json'
require_relative './patientrecord'
require 'debugger'
#opens broker connection to write-back to VistA Instance (kodak or panorama) uisng RPC
broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "lu1234", "lu1234!!", true)
broker.connect
broker.setContext('OR CPRS GUI CHART')

#this json file has one symptom
#json = File.read ('100615_Allergy_88074354_9986.json')

#this json file has two symptoms
json = File.read ('100716_Allergy_20131205_1608.json')
pr = JSON.parse(json) 

if pr['allergies'] != nil && pr['allergies']['list'] != nil
  thirdParameter = []
  #ord = Forgery(:basic).number(:at_least=>11111111, :at_most=>99999999).to_s
  pr['allergies']['list'].each do |list| 
    #GMRAGNT is the name of the allergy
    if list["key"] =="GMRAGNT" && list['value'] != "" 
      list['value'] = Forgery(:PatientRecord).allergies
      thirdParameter << ["\"#{list['key']}\"","#{list['value']}"]
      pr['allergies']['list'].each do |list|
        #GMRASYMP holds the symptoms
        if list["key"] =="GMRASYMP"   &&  list['ordinal'] !="0" 
          list["key"]
          list['value'] = Forgery(:PatientRecord).symptoms
        end
      end
    elsif  
     list['ordinal'] == nil || list['ordinal'] == ""
     thirdParameter << ["\"#{list['key']}\"","#{list['value']}"]
    else
     thirdParameter << ["\"#{list['key']}\",#{list['ordinal']}","#{list['value']}"]
    end
  end
     
  pr['allergies']['patientIEN'] = Forgery(:PatientRecord).patientIEN
  pr['allergies']['patientIEN']

  vrpc = VistaRPC4r::VistaRPC.new("ORWDAL32 SAVE ALLERGY", VistaRPC4r::RPCResponse::SINGLE_VALUE)

  # first parameter is the allergy IEN to update/insert, if inserting, default to 0
  vrpc.params[0] = "0" 

  # second parameter is the DFN of the patient 
  vrpc.params[1] = pr['allergies']['patientIEN'] 

  # third parameter is the list of allergy information to insert
  vrpc.params[2] = thirdParameter 
debugger
  resp = broker.execute(vrpc)

end
