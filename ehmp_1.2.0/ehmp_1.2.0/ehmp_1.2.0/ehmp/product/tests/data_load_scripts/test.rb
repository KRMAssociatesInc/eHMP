$LOAD_PATH.unshift('~/Projects/vistacore/ehmp/product/tests/vista-rpc-tests/vistarpc4r/lib/')
puts "Load paths......................"
puts $LOAD_PATH

require 'vistarpc4r'
  puts " "
  broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.102", 9210, "lu1234", "lu1234!!", false)
  puts "broker=[#{broker}]"
  puts "broker.connect=[#{broker.connect}]"
  puts "broker.setContext=[#{broker.setContext('OR CPRS GUI CHART')}]"

  puts " "
  med = "IBUPROFEN TAB"

  puts "Search for Medication.............[#{med}]"

  vrpc = VistaRPC4r::VistaRPC.new("ORWUL FVIDX", VistaRPC4r::RPCResponse::SINGLE_VALUE)

  puts "vrpc=[#{vrpc}]"
  vrpc.params = [
        "65",
        med.upcase
  ]
  puts "vrpc adding parms=[#{vrpc}]"

  resp = broker.execute(vrpc)
  puts "resp=[#{resp}]"
  puts " "
  puts "Get Medication Range.....4175 through 4185"
  vrpc2 = VistaRPC4r::VistaRPC.new("ORWUL FVSUB", VistaRPC4r::RPCResponse::ARRAY)
  puts "vrpc2=[#{vrpc2}]"
  vrpc2.params = [
        "65",
        "1364",
        "1464"
  ]
  puts "vrpc2 adding parms=[#{vrpc2}]"
  resp2 = broker.execute(vrpc2)
  puts "resp2=[#{resp2}]"


broker.close