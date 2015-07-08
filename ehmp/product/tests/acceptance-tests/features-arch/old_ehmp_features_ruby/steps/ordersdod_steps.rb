# Place holder for Immunization test information
class DefaultOrderDoDPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  def initialize
    @pid = "5000000116"
    @search_term = "Eight"
    @search_result_count = 24
    @patient_name = "Eight,Outpatient"
  end
end

Given(/^a patient with order in multiple VistAs and in DoD$/) do
  @test_patient = DefaultOrderDoDPatient.new
  p  @test_patient.pid
end
