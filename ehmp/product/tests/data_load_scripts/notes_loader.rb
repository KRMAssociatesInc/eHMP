require 'vistarpc4r'
require 'csv'

@broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "pro12345", "pro12345!!", false)
@broker.connect
@broker.setContext('OR CPRS GUI CHART')


def save_note(patient, type, text, location, date)


	vrpc = VistaRPC4r::VistaRPC.new("TIU CREATE RECORD", VistaRPC4r::RPCResponse::SINGLE_VALUE)
	vrpc.params = [
		patient, #patient id
		type, # note type
		"",
		"",
		"",
		[
			["1202","991"], #provider id
			["1301",date], # time
			["1205",location], #location
			["1701",""]
		],
		"#{location};#{date};A", # time and location
		"1"
	]

	resp = @broker.execute(vrpc)
	note_id = resp.value
	puts resp

	# save some text to the note


	vrpc = VistaRPC4r::VistaRPC.new("TIU SET DOCUMENT TEXT", VistaRPC4r::RPCResponse::SINGLE_VALUE)
	vrpc.params = [
		"#{note_id}",
		[
			["\"TEXT\",1,0",text],
			["\"HDR\"","1^1"]
		],
		"0"
	]

	resp = @broker.execute(vrpc)
	note_id = resp.value.split('^').first
	puts resp

	vrpc = VistaRPC4r::VistaRPC.new("TIU SIGN RECORD", VistaRPC4r::RPCResponse::SINGLE_VALUE)
	vrpc.params = [
		"#{note_id}",
		"%KpV7x&*p0"
	]

	resp = @broker.execute(vrpc)
	puts resp

end


CSV.foreach("./alpha_note_load.csv") do |row|
  # puts row
  unless row[0] == "Patient Name"
  	pat = row[0].split(" - ")[1]

  	type = row[1].split(" - ")[1]

  	text = row[2]

  	location = row[3].split(" - ")[1]


  	date = DateTime.strptime(row[4], "%m/%d/%Y %H:%M")
  	pre_value = 1 + (date.year / 1000)
  	date_string =  date.strftime('%y%m%d.%H%M')
  	date_string = "#{pre_value}" + date_string

  	save_note(pat, type, text, location, date_string)
  end
end

@broker.close