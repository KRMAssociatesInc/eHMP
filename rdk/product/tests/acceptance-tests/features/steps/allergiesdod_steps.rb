# Place holder for Allergy test information
class DefaultAllergyDoDPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_allergies
  def initialize
    @pid = "10108"
    @search_term = "Eight"
    @search_result_count = 38
    @patient_name = "Eight,Patient"
    @num_allergies = 5
  end
end

# Place holder for Alergy Demo test information
class DefaultAllergyDoDDemoPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_procedures
  def initialize
    @pid = "10102"
    @search_term = "Two,Patient"
    @search_result_count = 1
    @patient_name = "Two,Patient"
    @num_allergies = 9
    @num_procedures = 6
  end
end

Given(/^a patient with "(.*?)" in multiple VistAs and in DoD$/) do |_arg1|
  @test_patient = DefaultAllergyDoDPatient.new
  p @test_patient.pid
end

Given(/^a patient with allergies in multiple VistAs and in DoD$/) do
  @test_patient = DefaultAllergyDoDPatient.new
  p @test_patient.pid
end

