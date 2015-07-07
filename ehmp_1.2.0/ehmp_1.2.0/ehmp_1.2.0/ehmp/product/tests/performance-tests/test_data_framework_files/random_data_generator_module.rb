module RandomDataGenerator
	require 'rubygems'
	require 'vistarpc4r'
	require 'forgery'
	require 'json'
	require_relative './patientrecord'
	require 'debugger'
	require 'prettyprint'

  # Used to generate random allergies, and symptoms for random
	# patients
	class Allergy

		def initialize
			# this is required for all allergies
      @gmranatr = 'A^Allergy'
		end

		# randomly generates allergies and assigns them to 
		# random patients
		def gen_allergy(num_of_patients = 1, num_of_symp = 1) 

		
			# determine the number of patients in the dictionary
			# patientIEN
			patient = Patient.new
			patient_count = patient.count
			if num_of_patients > patient_count
				num_of_patients = patient_count
			end

			num_of_patients.times do

				vrpc = VistaRPC4r::VistaRPC.new("ORWDAL32 SAVE ALLERGY", \
				VistaRPC4r::RPCResponse::SINGLE_VALUE)	
				vrpc.params[0] = '0'
				# randomly select a patient id
        # if this patient has already been chosen pick a new one
				patientIEN = patient.verify_patient Forgery(:PatientRecord).patientIEN 
				vrpc.params[1] = patientIEN 
        gmragnt = Forgery(:PatientRecord).allergies
 				gmraorig = '10000000224'
				gmraordt = '3131205.1608'

				if gmragnt.include? '120.82'
					gmratype = 'D^Drug'
				elsif gmragnt.include? '50.6'
					gmratype = 'F^Food'
				else
					gmratype = 'O^Other'
				end
				vrpc.params[2]=[['GMRAGNT',gmragnt],['GMRATYPE',gmratype],
												['GMRANATR',@gmranatr],['GMRAORIG',gmraorig],
												['GMRAORDT',gmraordt]]
				pp vrpc.params[2].inspect #TEST CODE - REMOVE
			end
		end
	end

	class Patient
		def initialize
			@patientIENs=[]	
 	 	end
 	 	# counts the number of patients in the dictionary file
 	 	def count
   	 file=File.open 'patientIEN', 'r'
   	 file.readlines.size
 	 	end
		# the number of patients in the dictionary.
  	def verify_patient(patientIEN)
   	 if @patientIENs.include? patientIEN
   	   patientIEN = Forgery(:PatientRecord).patientIEN
   	   verify_patient patientIEN
   	 else
   	   @patientIENs << patientIEN
   	 end
   	 patientIEN
  	end
	end
     
	class Vital
	end
  
	class Med
	end

	class Order
	end

end
