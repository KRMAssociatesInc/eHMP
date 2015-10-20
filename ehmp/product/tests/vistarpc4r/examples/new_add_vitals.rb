# require 'rubygems'
# # require 'vistarpc4r'
# 
# require './../lib/vistarpc4r/rpc_response'
# require './../lib/vistarpc4r/vista_rpc'
# require './../lib/vistarpc4r/rpc_broker_connection'
# 
# path = File.expand_path '..', __FILE__
# $LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
# path = File.expand_path '../../../../acceptance-tests/features/steps', __FILE__
# p path
# $LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
# 
# # require "TestSupport.rb"
# require "httparty"
# ppp
# 
# broker = VistaRPC4r::RPCBrokerConnection.new('10.2.2.101', 9210, 'pu1234', 'pu1234!!', false)
# 
# broker.connect
# p "The RPC Broker Connection status is #{broker.isConnected}"
# 
# broker.setContext('OR CPRS GUI CHART')
# 
# #wardsrpc = VistaRPC4r::VistaRPC.new("ORQPT WARDS", VistaRPC4r::RPCResponse::ARRAY)
# #wardsresponse = broker.execute(wardsrpc)
# #wardsresponse.value.each do |d|
# #  puts d
# #end
# 
# 
# # preset some variables
# dfn = "123"  # internal id of the patient, CLINICAL, Male
# provider ="10000000177"  #internal id of care provider Physican, User
# location = "GEN MED"  # hospital location  ICU=1 MED/SURG=2 PSYCH=3
# thedate = "3110525"
# thedatetime = "3110525.160100"
# # Vitals
# puts "Vitals before adding-------------------------------------"
# patientrpc = VistaRPC4r::VistaRPC.new("ORQQVI VITALS", VistaRPC4r::RPCResponse::ARRAY)
# patientrpc.params[0]=dfn #patient ien
# # p patientrpc
# patientresponse = broker.execute(patientrpc)
# patientresponse.value.each do |d|
  # puts d
# end
# 
# p "--------------------1st"
# broker.setContext('HMP UI CONTEXT')
# data_vitals = {}
# #  Add a new problem
# # vrpc = VistaRPC4r::VistaRPC.new("HMP PUT OPERATIONAL DATA", VistaRPC4r::RPCResponse::ARRAY)
# vrpc = VistaRPC4r::VistaRPC.new("HMP PUT OPERATIONAL DATA", VistaRPC4r::RPCResponse::SINGLE_VALUE)
# # vrpc.params[0]= 0
# # vrpc.params[1]= 123
# # p data_vitals["domain"] = "vitals"
# # p data_vitals["data"] = "3150616.0900^123^1;120/60;^67^5*2:38:50:75"
                # # # [
                  # # # ["1", "VST^DT^#{thedatetime}"],  # Vital date
                  # # # ["2", "VST^PT^#{dfn}"], # Patient
                  # # # ["3", "VST^HL^#{location}"], # location
                  # # # ["4", "VIT^BP^^^120/60^#{provider}^^#{thedatetime}"]
                 # # # ]
                 # # p data_vitals
# # vrpc.params[2] = data_vitals
# # vrpc.params = [
  # # 0,
  # # 123,
  # # [
    # # ['"domain"','vitals'],
    # # ['"data"', '3150616.0900^123^1;120/60;^67^5*2:38:50:75']
  # # ]
# # ]
# 
      # vrpc.params[0] = "0"
      # vrpc.params[1] = "123"
      # vrpc.params[2] = [
                  # ["\"domain\"", "vitals"],
                  # ["\"data\"", "3150701^123^1;120/80;^23^10000000224*2:38:50:75"]
                 # ]
# p vrpc
# resp=broker.execute(vrpc)
# p "*"*10
# puts resp
# puts resp.class
# puts t = resp.value
# puts t.class
# json_object = JSON.parse(t.body)
# 
# # puts t = resp.to_s
# # puts t1 = t.split(",")
# p "*"*10
# 
# puts "Vitals after adding-------------------------------------"
# broker.setContext('OR CPRS GUI CHART')
# patientrpc = VistaRPC4r::VistaRPC.new("ORQQVI VITALS", VistaRPC4r::RPCResponse::ARRAY)
# patientrpc.params[0]=dfn #patient ien
# patientresponse = broker.execute(patientrpc)
# patientresponse.value.each do |d|
  # puts d
# end
# 
# p '[End]'
