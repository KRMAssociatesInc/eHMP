require 'vistarpc4r'

@patients = [
	'666000088',
	'666000089',
	'666000090',
	'666000091',
	'666000092',
	'666000093',
	'666000094',
	'666000095',
	'666000096',
	'666000097',
	'666000098',
	'666000099',
	'666000100',
	'666000000',
	'666330008',
	'666000121',
	'666000126',
	'666000131',
	'666000136',
	'666000141',
	'666000146',
	'666000201',
	'666000206',
	'666000211',
	'666000216',
	'666000221',
	'666000226',
	'666000231',
	'666000236',
	'666000241',
	'666000246',
	'666000249',
	'666000251',
	'666000256',
	'666000261',
	'666000266',
	'666000271',
	'666000276',
	'666000281',
	'666000286',
	'666000291',
	'666000296',
	'666000301',
	'666000151',
	'666000156',
	'666000161',
	'666000166',
	'666000171',
	'666000176',
	'666000181',
	'666000186',
	'666000191',
	'666000196',
	'666000306',
	'666000316',
	'666000321',
	'666000326',
	'666000331',
	'666000336',
	'666000341',
	'666000346',
	'666000351',
	'666000356',
	'666000361',
	'666000366',
	'666000371',
	'666000376',
	'666000381',
	'666000386',
	'666000391',
	'666000396',
	'666000401',
	'666000406',
	'666000411',
	'666000416',
	'666000421',
	'666000426',
	'666000431',
	'666000436',
	'666000441',
	'666000446',
	'666000311',
	'666000451',
	'666000456',
	'666000461',
	'666000466',
	'666000471',
	'666000476',
	'666000481',
	'666000486',
	'666000491',
	'666000496',
	'666000501',
	'666000506',
	'666000511',
	'666000516',
	'666000521',
	'666000526',
	'666000531',
	'666000536',
	'666000541',
	'666000546',
	'666000551',
	'666000556',
	'666000561',
	'666000566',
	'666000571',
	'666000576',
	'666000581',
	'666000586',
	'666000591',
	'666000596',
	'666661601',
	'666000600',
	'666000601',
	'666000602',
	'666000603',
	'666000604',
	'666000605',
	'666000606',
	'666000607',
	'666000608',
	'666000609',
	'666000610',
	'666000611',
	'666000612',
	'666000613',
	'666000614',
	'666000615',
	'666000616',
	'666000617',
	'666000618',
	'666000619',
	'666000620',
	'666000621',
	'666000622',
	'666000623',
	'666000624',
	'666000625',
	'666000626',
	'666000627',
	'666000628',
	'666000629',
	'666000630',
	'666000631',
	'666000632',
	'666000633',
	'666000634',
	'666000635',
	'666000636',
	'666000637',
	'666000638',
	'666000639',
	'666000640',
	'666000641',
	'666000642',
	'666000643',
	'666000644',
	'666000645',
	'666000646',
	'666000647',
	'666000648',
	'666000649',
	'666000650',
	'666000651',
	'666000652',
	'666000653',
	'666000654',
	'666000655',
	'666000656',
	'666000657',
	'666000658',
	'666000659',
	'666000660',
	'666000661',
	'666000662',
	'666000663',
	'666000664',
	'666000665',
	'666000666',
	'666000667',
	'666000668',
	'666000669',
	'666000670',
	'666000671',
	'666000672',
	'666000673',
	'666000674',
	'666000675',
	'666000676',
	'666000677',
	'666000678',
	'666000679',
	'666000680',
	'666000681',
	'666000682',
	'666000683',
	'666000684',
	'666000685',
	'666000686',
	'666000687',
	'666000688',
	'666000689',
	'666000690',
	'666000691',
	'666000692',
	'666000693',
	'666000694',
	'666000695',
	'666000696',
	'666000697',
	'666000698',
	'666000699',
	'666000700',
	'666000800',
	'666000802',
	'666000803',
	'666000804',
	'666000805',
	'666000806',
	'666000807',
	'666000808',
	'666000809',
	'666000810',
	'666000811',
	'666000812',
	'666000813',
	'666000814',
	'666000815',
	'666000816',
	'666000817',
	'666000818',
	'666000819',
	'666000820',
	'666000821',
	'666000822',
	'666000823',
	'666000824',
	'666000825',
	'666000826',
	'666000827',
	'666000828',
	'666000829',
	'666000830',
	'666000831',
	'666000832',
	'666000833',
	'666000834',
	'666000835',
	'666000836'
]

load_start_time = Time.now
puts "Starting Data Upload"

@broker = VistaRPC4r::RPCBrokerConnection.new("10.2.2.101", 9210, "lu1234", "lu1234!!", false)
@broker.connect
@broker.setContext('OR CPRS GUI CHART')

def format_params(params, ssn, increment, ssn_name = "PAT_SSN")
	formated_params = [
		["1", "#{ssn_name}^#{ssn}"]
	]

	params.each_with_index do |item, index|
		item = item.sub("T-", "T-#{increment}")
		item = item.sub("T+", "T+#{increment}")

		formated_params << ["#{index+2}", item]
	end
	formated_params
end

def rpc_load(name, rpc, params, times = [1], ssn_name = "PAT_SSN")
	start = Time.now
	puts  "Loading #{name}\n"
	@vrpc = VistaRPC4r::VistaRPC.new(rpc, VistaRPC4r::RPCResponse::ARRAY)

	@ssn_name  = ssn_name

	def exicute(times, ssn, params)
		x = 1

		until x > times
			formated_params = format_params(params, ssn, x, @ssn_name)
			@vrpc.params = [formated_params]
			resp = @broker.execute(@vrpc)

			# puts resp

			x += 1
		end
	end

	count = 0
	@patients.each do |ssn|
		count += 1

		per_count = @patients.count / times.count

		index = (count - 1) / per_count
		time = times[index]
		exicute(time, ssn, params)

		percent = count / @patients.count.to_f

		load_done = (percent*100).to_i


		output = "["

		load_done.times do
			output += "="
		end

		(100 - load_done).times do
			output += " "
		end

		output += "]"

		print "\r"
		print output
	end

	comp_time = (Time.now - start).to_f.divmod(60)
	comp_mins = comp_time[0]
	comp_secs = comp_time[1].round(1)


	puts  "\n#{name} Load Completed in #{comp_mins} Mins #{comp_secs} Secs \n"
end

params = [
	"HISTORIC^1",
	"ALLERGEN^POLLEN",
	"SYMPTOM^ITCHING",
	"SYMPTOM^ITCHING,WATERING EYES",
	"ORIG_DATE^T-",
	"ORIGINTR^PROVIDER,ONE"
]

rpc_load("Allergies", "ISI IMPORT ALLERGY", params)

params = [
	"CONSULT^CARDIOLOGY",
	"LOC^PRIMARY CARE",
	"PROV^PROVIDER,ONE",
	"TEXT^Testing consult importer."
]

rpc_load("Consults", "ISI IMPORT CONSULT", params)

params = [
	"RAPROC^KNEE 2 VIEWS",
	"MAGLOC^RADIOLOGY MAIN FLOOR",
	"PROV^PROVIDER,ONE",
	"RADTE^T+",
	"REQLOC^PRIMARY CARE",
	"REASON^This is a test.",
	"HISTORY^This is some history."
]

rpc_load("Orders", "ISI IMPORT RAD ORDER", params, [200])

params = [
	"ADATE^T-@14:00",
	"CLIN^PRIMARY CARE"
]

rpc_load("Appointments 1/2", "ISI IMPORT APPT", params, [50, 65, 75, 85, 100], "PATIENT")


params = [
	"ADATE^T-@8:00",
	"CLIN^GENERAL MEDICINE"
]

rpc_load("Appointments 2/2", "ISI IMPORT APPT", params, [50, 65, 75, 85, 100], "PATIENT")



params = [
	"VITAL_TYPE^BLOOD PRESSURE",
	"RATE^172/63",
	"LOCATION^PRIMARY CARE",
	"DT_TAKEN^T-",
	"ENTERED_BY^PROVIDER,ONE"
]

rpc_load("Vitals 1/2", "ISI IMPORT VITALS", params, [50, 200, 300, 400, 500])

params = [
	"VITAL_TYPE^TEMPERATURE",
	"RATE^89.6",
	"LOCATION^GENERAL MEDICINE",
	"DT_TAKEN^T-",
	"ENTERED_BY^NURSE,TEN"
]

rpc_load("Vitals 2/2", "ISI IMPORT VITALS", params, [50, 200, 300, 400, 500])

params = [
	"TIU_NAME^CRISIS NOTE",
	"VLOC^GENERAL MEDICINE",
	"VDT^T-",
	"PROV^PROVIDER,ONE",
	"TEXT^Another test."
]

rpc_load("Notes 1/2", "ISI IMPORT NOTE", params, [125, 250, 375, 500, 600])


params = [
	"TIU_NAME^CARDIOLOGY NOTE",
	"VLOC^PRIMARY CARE",
	"VDT^T-",
	"PROV^PROVIDER,ONE",
	"TEXT^This is a test of the note stuffer."
]

rpc_load("Notes 2/2", "ISI IMPORT NOTE", params, [125, 250, 375, 500, 600])

load_time = (Time.now - load_start_time).to_f.divmod(60)
load_mins = load_time[0]
load_secs = load_time[1].round(1)

puts  "Load Completed! in #{load_mins} Mins #{load_secs} Secs"

