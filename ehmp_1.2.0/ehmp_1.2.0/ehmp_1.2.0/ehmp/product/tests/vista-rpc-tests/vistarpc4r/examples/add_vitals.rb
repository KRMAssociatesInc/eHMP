require 'rubygems'
# require 'vistarpc4r'

require './../lib/vistarpc4r/rpc_response'
require './../lib/vistarpc4r/vista_rpc'
require './../lib/vistarpc4r/rpc_broker_connection'

broker = VistaRPC4r::RPCBrokerConnection.new('10.2.2.101', 9210, 'pu1234', 'pu1234!!', false)

broker.connect
p "The RPC Broker Connection status is #{broker.isConnected}"

broker.setContext('OR CPRS GUI CHART')

#wardsrpc = VistaRPC4r::VistaRPC.new("ORQPT WARDS", VistaRPC4r::RPCResponse::ARRAY)
#wardsresponse = broker.execute(wardsrpc)
#wardsresponse.value.each do |d|
#  puts d
#end


# preset some variables
dfn = "123"  # internal id of the patient, CLINICAL, Male
provider ="10000000177"  #internal id of care provider Physican, User
location = "GEN MED"  # hospital location  ICU=1 MED/SURG=2 PSYCH=3
thedate = "3110525"
thedatetime = "3110525.160100"
# Vitals
puts "Vitals before adding-------------------------------------"
patientrpc = VistaRPC4r::VistaRPC.new("ORQQVI VITALS", VistaRPC4r::RPCResponse::ARRAY)
patientrpc.params[0]=dfn #patient ien
patientresponse = broker.execute(patientrpc)
patientresponse.value.each do |d|
  puts d
end

p "--------------------"
#  Add a new problem
vrpc = VistaRPC4r::VistaRPC.new("ORQQVI2 VITALS VAL & STORE", VistaRPC4r::RPCResponse::ARRAY)
vrpc.params[0] = [
                  ["1", "VST^DT^#{thedatetime}"],  # Vital date
                  ["2", "VST^PT^#{dfn}"], # Patient
                  ["3", "VST^HL^#{location}"], # location
                  ["4", "VIT^BP^^^120/160^#{provider}^^#{thedatetime}"]
                 ]
                 p vrpc
resp=broker.execute(vrpc)
puts resp

puts "Vitals after adding-------------------------------------"
patientrpc = VistaRPC4r::VistaRPC.new("ORQQVI VITALS", VistaRPC4r::RPCResponse::ARRAY)
patientrpc.params[0]=dfn #patient ien
patientresponse = broker.execute(patientrpc)
patientresponse.value.each do |d|
  puts d
end

p '[End]'
