# Place holder for Immunization test information
class DefaultImmunizationDoDPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  def initialize
    @pid = "10108"
    @search_term = "Eight"
    @search_result_count = 21
    @patient_name = "Eight,Patient"
  end
end

Given(/^a patient with immunization in multiple VistAs and in DoD$/) do
  @test_patient = DefaultImmunizationDoDPatient.new
  p  @test_patient.pid
end
