# Place holder for Vital test information
class DefaultVitalDoDPatient
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
    @num_vitals = 208
  end
end

# Place holder for Vital Demo test information
class DefaultVitalDoDDemoPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_procedures
  def initialize
    @pid = "5000000116"
    @search_term = "Eight,Outpatient"
    @search_result_count = 1
    @patient_name = "Eight,Outpatient"
    @num_vitals = 8
  end
end

Given(/^a patient with vitals in multiple VistAs and in DoD$/) do
  @test_patient = DefaultVitalDoDPatient.new
  p  @test_patient.pid
end

