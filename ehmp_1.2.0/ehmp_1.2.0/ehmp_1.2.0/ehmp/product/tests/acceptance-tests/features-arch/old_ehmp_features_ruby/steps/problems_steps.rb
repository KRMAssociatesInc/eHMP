# Place holder for Problem test information
class DefaultProblemPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_problems
  def initialize
    @pid = "10108"
    @search_term = "Eight"
    @search_result_count = 38
    @patient_name = "Eight,Patient"
    @num_problems = 5
  end
end

class DefaultProblemPatientDOD
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_problems
  def initialize
    @pid = "10108"
    @search_term = "Eight"
    @search_result_count = 38
    @patient_name = "Eight,Patient"
    @num_problems = 22
  end
end

Given(/^a patient with problems in multiple VistAs$/) do
  @test_patient = DefaultProblemPatient.new
end

Given(/^a patient with problems in multiple VistAs and in DoD$/) do
  @test_patient = DefaultProblemPatientDOD.new
end

When(/^the client requests problems for that patient$/) do
  pid = @test_patient.pid
  query_with_path_no_range "/vpr/view/gov.va.cpe.vpr.queryeng.ProblemViewDef", pid
end

When(/^the client requests problems for the patient "(.*?)"$/) do |pid|
  query_with_path_no_range "/vpr/view/gov.va.cpe.vpr.queryeng.ProblemViewDef", pid
end

Then(/^eHMP returns all problems in the results$/) do
  num_expected_results = @test_patient.num_problems
  num_of_actual_results = count_number_of_results
  expect(num_of_actual_results).to be(num_expected_results)
end
