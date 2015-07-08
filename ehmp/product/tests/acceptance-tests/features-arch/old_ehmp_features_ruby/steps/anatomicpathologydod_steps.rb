# Place holder for Pathology test information
class DefaultPathologyDoDPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  def initialize
    @pid = "10110"
    @search_term = "Ten"
    @search_result_count = 7
    @patient_name = "Ten,Patient"
  end
end

Given(/^a patient with anatomic pathology in multiple VistAs and in DoD$/) do
  @test_patient = DefaultPathologyDoDPatient.new
  p  @test_patient.pid
end
