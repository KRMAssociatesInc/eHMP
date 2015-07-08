# Place holder for Immunization test information
class DefaultProblemListDoDPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  def initialize
    @pid = "5000000217"
    @search_term = "Eight"
    @search_result_count = 15
    @patient_name = "Eight,Inpatient"
  end
end

Given(/^a patient with problem list in multiple VistAs and in DoD$/) do
  @test_patient = DefaultProblemListDoDPatient.new
  p  @test_patient.pid
end
