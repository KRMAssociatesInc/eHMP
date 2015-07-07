#
class DefaultProcedurePatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_procedures
  def initialize
    @pid = "10110"
    @search_term = "Ten"
    @search_result_count = 4
    @patient_name = "Ten,Patient"
    @num_procedures = 27
  end
end

Given(/^a patient with procedures in multiple VistAs$/) do
  @test_patient = DefaultProcedurePatient.new
end

When(/^the client requests procedures for that patient$/) do
  pid = @test_patient.pid
  query_with_path_no_range "/vpr/view/gov.va.cpe.vpr.queryeng.ProceduresViewDef", pid
end

When(/^the client requests procedures for the patient "(.*?)"$/) do |pid|
  query_with_path_no_range "/vpr/view/gov.va.cpe.vpr.queryeng.ProceduresViewDef", pid
end

Then(/^eHMP returns all procedures in the results$/) do
  num_expected_results = @test_patient.num_procedures
  num_of_actual_results = count_number_of_results
  expect(num_of_actual_results).to eq(num_expected_results)
end
