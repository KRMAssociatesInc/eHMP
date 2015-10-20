require 'vistarpc4r'

@broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "pro12345", "pro12345!!", false)
@broker.connect
@broker.setContext('OR CPRS GUI CHART')

all_types = []
last_type = ""

def get_types(last_type, all_types)

	vrpc = VistaRPC4r::VistaRPC.new("ORWU1 NEWLOC", VistaRPC4r::RPCResponse::ARRAY)

	vrpc.params = [
		last_type,
		"1",
	]

	resp = @broker.execute(vrpc)


	resp.value.each do |d|
		array = d.split('^')

	   	unless array[1].nil?
	   		unless array[1].include?('<')
				all_types << "#{array[1]} - #{array[0]}"
	   		end
		end
	end

	# resp.value.each do |d|
	# 	puts d
	# end

	if resp.value.count > 0
		last = resp.value.last.split('^')
		last_type = last[1]

		get_types(last_type, all_types)
	end
end

get_types(last_type, all_types)

puts all_types







# TIU LONG LIST OF TITLES

# Params ------------------------------------------------------------------
# literal	3
# literal
# literal	1





# save a note


# vrpc = VistaRPC4r::VistaRPC.new("TIU CREATE RECORD", VistaRPC4r::RPCResponse::SINGLE_VALUE)
# vrpc.params = [
# 	"100841", #patient id
# 	"16", # note type
# 	"",
# 	"",
# 	"",
# 	[
# 		["1202","991"], #provider id
# 		["1301","3150421.1150"], # time
# 		["1205","195"], #location
# 		["1701",""]
# 	],
# 	"195;3140512.13;A", # time and location
# 	"1"
# ]

# resp = broker.execute(vrpc)
# note_id = resp.value


# # save some text to the note


# vrpc = VistaRPC4r::VistaRPC.new("TIU SET DOCUMENT TEXT", VistaRPC4r::RPCResponse::SINGLE_VALUE)
# vrpc.params = [
# 	"#{note_id}",
# 	[
# 		["\"TEXT\",1,0","Note Signed"],
# 		["\"HDR\"","1^1"]
# 	],
# 	"0"
# ]

# resp = broker.execute(vrpc)

# vrpc = VistaRPC4r::VistaRPC.new("ORWPCE SAVE", VistaRPC4r::RPCResponse::SINGLE_VALUE)
# vrpc.params = [
# 	[
# 		["1","HDR^0^^32;3150421.1150;A"], # time = 3150416.15135
# 		["2","VST^DT^3150421.1150"], # visit time
# 		["3","VST^PT^100841"], # patient icn
# 		["4","VST^HL^32"], # location, primary care
# 		["5","VST^VC^A"], # ????
# 		["6","PRV^991^^^PROVIDER,EIGHT^1"], # provider
# 		["7","PED+^612055^^HTN EXERCISE^@^^^^^1"], # ed
# 		["8","COM^1^@"],
# 		["9","HF+^2^^CURRENT SMOKER^H^^^^^1^"], # health factor
# 		["10","COM^2^@"],
# 		["11","HF+^5^^CURRENT SMOKER^H^^^^^1^"], # health factor
# 		["12","COM^3^@"]
# 	],
# 	"#{note_id}",
# 	"32"
# ]

# resp = broker.execute(vrpc)

# puts resp

# # sign me!!!

# vrpc = VistaRPC4r::VistaRPC.new("TIU SIGN RECORD", VistaRPC4r::RPCResponse::SINGLE_VALUE)
# vrpc.params = [
# 	"#{note_id}",
# 	"%KpV7x&*p0"
# ]

# resp = broker.execute(vrpc)

# puts resp

@broker.close