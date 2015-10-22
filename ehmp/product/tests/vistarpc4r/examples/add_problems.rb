# require 'rubygems'
# 
# require './../lib/vistarpc4r/rpc_response'
# require './../lib/vistarpc4r/vista_rpc'
# require './../lib/vistarpc4r/rpc_broker_connection'
# 
# broker = VistaRPC4r::RPCBrokerConnection.new('10.2.2.101', 9210, 'pu1234', 'pu1234!!', false)
# 
# broker.connect
# p "The RPC Broker Connection status is #{broker.isConnected}"
# 
# #broker = RPCBrokerConnection.new('192.168.1.20', 9270, 'sys.admin', 'vista!123')
# # broker = RPCBrokerConnection.new('10.2.2.101', 9210, 'pu1234', 'pu1234!!', false)
# 
# # broker.connect
# broker.setContext('OR CPRS GUI CHART')
# 
# dfn = "3"  # internal id of the patient, CLINICAL, Male
# provider ="42"  #internal id of care provider Physican, User
# # Problem list
# puts "Problem list-------------------------------------"
# vrpc = VistaRPC4r::VistaRPC.new("ORQQPL LIST", VistaRPC4r::RPCResponse::ARRAY)
# vrpc.params[0]=dfn #patient ien
# vrpc.params[1]="A"
# resp = broker.execute(vrpc)
# resp.value.each do |d|
  # puts d
# end
# 
# # Get Basic patient information that is used for problem list modification RPCs
# vrpc = VistaRPC4r::VistaRPC.new("ORQQPL INIT PT", VistaRPC4r::RPCResponse::ARRAY)
# vrpc.params[0]=dfn
# resp = broker.execute(vrpc)
# ptVAMC=resp.value[0]  #             := copy(Alist[i],1,999);
# ptDead=resp.value[1]  #             := AList[i];
# ptBID=resp.value[6]   #             := Alist[i];
# ptname=""
# gmpdfn = dfn + "^" + ptname + "^" + ptBID + "^" + ptDead
# puts gmpdfn
# 
# #  Add a new problem
# vrpc = VistaRPC4r::VistaRPC.new("ORQQPL ADD SAVE", VistaRPC4r::RPCResponse::ARRAY)
# vrpc.params[0]=gmpdfn
# vrpc.params[1]= provider
# vrpc.params[2]= ptVAMC
# vrpc.params[3] = [
                  # ["1", "GMPFLD(.01)=\"\"\"819.01\"\"\""],  # Diagnosis
                  # ["2", "GMPFLD(.05)=\"\"\"^add-problem--test\"\"\""], # Narrative
                  # ["3", "GMPFLD(.12)=\"\"\"A\"\"\""], # status  A?
                  # ["4", "GMPFLD(.13)=\"\"\"\"\"\""], # Date of onset
                  # ["5", "GMPFLD(1.01)=\"\"\"\"\"\""], # Problem
                  # ["6", "GMPFLD(10,0)=\"\"\"\"\"\""] # Note
                 # ]
# resp=broker.execute(vrpc)
# puts resp
# 
# vrpc = VistaRPC4r::VistaRPC.new("ORQQPL LIST", VistaRPC4r::RPCResponse::ARRAY)
# vrpc.params[0]=dfn #patient ien
# vrpc.params[1]="A"
# resp = broker.execute(vrpc)
# resp.value.each do |d|
  # puts d
# end
# 
# #vrpc = VistaRPC.new("ORQQPL DELETE", RPCResponse::SINGLE_VALUE)
# #vrpc.params[0]="34"
# #vrpc.params[1]=provider
# #vrpc.params[2]=ptVAMC
# #vrpc.params[3]="Because"
# #resp=broker.execute(vrpc)
# #puts resp
