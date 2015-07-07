# Place holder for Vital test information
class DefaultVitalPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_vitals
  def initialize
    @pid = "10108"
    @search_term = "Eight"
    @search_result_count = 38
    @patient_name = "Eight,Patient"
    @num_vitals = 166
  end
end

Given(/^a patient with vitals in multiple VistAs$/) do
  @test_patient = DefaultVitalPatient.new
end

When(/^the client requests vitals for that patient$/) do
  pid = @test_patient.pid
  query_with_path_no_range "/vpr/view/gov.va.cpe.vpr.queryeng.VitalsViewDef", pid
end

When(/^the client requests vitals for the patient "(.*?)"$/) do |pid|
  query_with_path_no_range "/vpr/view/gov.va.cpe.vpr.queryeng.VitalsViewDef", pid
end

Then(/^eHMP returns all vitals in the results$/) do
  num_expected_results = @test_patient.num_vitals
  num_of_actual_results = count_number_of_results
  expect(num_of_actual_results).to be(num_expected_results)
end
