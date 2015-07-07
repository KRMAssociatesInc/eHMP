#
class DefaultRadiologyPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_procedures
  def initialize
    @pid = "10110"
    @search_term = "Ten"
    @search_result_count = 32
    @patient_name = "Ten,Patient"
  end
end

Given(/^a patient with radiology procedures in multiple VistAs and DoD$/) do
  @test_patient = DefaultRadiologyPatient.new
end

#When(/^the client requests radiology procedures for the patient "(.*?)"$/) do |pid|
#  query_with_path_custom_arg "/vpr/view/gov.va.cpe.vpr.queryeng.ProceduresViewDef", pid, "qfilter_kind", "Radiology"
#end
