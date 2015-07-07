require 'vistarpc4r'


broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "lu1234", "lu1234!!", false)
broker.connect
broker.setContext('OR CPRS GUI CHART')

# get problem list
# vrpc = VistaRPC4r::VistaRPC.new("ORQQPL LIST", VistaRPC4r::RPCResponse::ARRAY)

# vrpc.params = [
#   "100841",
#   "A"
# ]

# puts "Problem list-------------------------------------"
# resp = broker.execute(vrpc)

# resp.value.each do |d|
#   puts d
# end

# # get other problem codes?

# vrpc = VistaRPC4r::VistaRPC.new("ORQQPL4 LEX", VistaRPC4r::RPCResponse::ARRAY)

# vrpc.params =  [
#   "Headache",
#   "",
#   "2"
# ]

# puts "Problem code-------------------------------------"
# resp = broker.execute(vrpc)

# resp.value.each do |d|
#   puts d
# end

# # get problem codes

# vrpc = VistaRPC4r::VistaRPC.new("ORQQPL PROBLEM LEX SEARCH", VistaRPC4r::RPCResponse::ARRAY)

# vrpc.params =  [
#   "Headache",
#   "2",
#   "",
#   "0"
# ]

# puts "Problem code-------------------------------------"
# resp = broker.execute(vrpc)

# resp.value.each do |d|
#   puts d
# end


vrpc = VistaRPC4r::VistaRPC.new("ORQQPL INIT PT", VistaRPC4r::RPCResponse::ARRAY)
vrpc.params[0]="100841"
resp = broker.execute(vrpc)
puts resp


ptVAMC=resp.value[0]  #             := copy(Alist[i],1,999);
ptDead=resp.value[1]  #             := AList[i];
ptBID=resp.value[6]   #             := Alist[i];
ptname=""
gmpdfn = "100841" + "^" + ptname + "^" + ptBID + "^" + ptDead
# puts gmpdfn


vrpc = VistaRPC4r::VistaRPC.new("ORQQPL ADD SAVE", VistaRPC4r::RPCResponse::ARRAY)
vrpc.params[0] = gmpdfn
vrpc.params[1] = "1"
vrpc.params[2] = ptVAMC
vrpc.params[3] = [
                  ["1", "GMPFLD(.01)=\"\""],  # Diagnosis
                  ["2", "GMPFLD(.05)=\"^Back Pain\""], # Narrative
                  ["3", "GMPFLD(.12)=\"A\""], # activie or inactive
                  ["4", "GMPFLD(.13)=\"3150801^AUG 10 2014\""], # Date of onset
                  ["5", "GMPFLD(1.01)=\"\"\"\"\"\""], # Problem??
                  ["6", "GMPFLD(1.08)=\"16\""], # location code
                  ["7", "GMPFLD(1.1)=\"0^NO\""], # Problem
                  ["8", "GMPFLD(1.14)=\"C\""], #accute or cronic
                  ["9", "GMPFLD(10,0)=\"\"\"\"\"\""], # Note
                  ["10", "GMPFLD(80001)=\"134407002\""] # snowmed
                 ]





resp = broker.execute(vrpc)
# puts resp

broker.close

