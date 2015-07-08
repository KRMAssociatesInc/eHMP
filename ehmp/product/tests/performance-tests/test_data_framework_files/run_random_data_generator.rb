=begin
require 'rubygems'
require 'vistarpc4r'
require 'forgery'
require 'json'
require_relative './patientrecord'
require 'debugger'

class Allergy
		def initialize
			@patientIENs=[]
		end
    def verify_patient(patientIEN)
			puts @patientIENs.inspect
      if @patientIENs.include? patientIEN
        patientIEN = Forgery(:PatientRecord).patientIEN
        verify_patient patientIEN
      else
        @patientIENs << patientIEN
      end
      patientIEN
    end
end

class Patient
	def initialize
	end
	# counts the number of patients in the dictionary file
	def count
		file=File.open 'patientIEN', 'r'
		file.readlines.size
	end
end

allergy = Allergy.new
patient = Patient.new
puts allergy.verify_patient 'xxx123'
puts allergy.verify_patient 'xxx123'
puts allergy.verify_patient '100022'
puts patient.count
=end

require_relative './random_data_generator_module'
allergy=RandomDataGenerator::Allergy.new
allergy.gen_allergy 2
