### F129 Vital Signs Resource Test Steps ###

### Closest Reading US2459 Steps ###

When(/^the client requests the closest reading of type "(.*?)" for a patient with dfn "(.*?)"$/) do |vitalType, dfn|
  path = String.new(DefaultLogin.rdk_fetch_url)
  @response = HTTPartyWithBasicAuth.get_with_authorization(path+'/resource/vitals/closest?dfn='+dfn+'&ts=&type='+vitalType+'&flag=&pid=10108V420871')
end

Then(/^the JSON response "(.*?)" field is "(.*?)"$/) do |path, value|
  json = JSON.parse(@response.body)
  accessors = path.split('.')
  accessors.each do |accessor|
    if accessor.include?('[')
      accessor1 = accessor[0...accessor.index('[')]
      accessor2 = accessor[accessor.index('[')+1..-2]
      json = json[accessor1]
      json = json[accessor2.to_i]
    else
      json = json[accessor]
    end
  end
  expect(json).to eq(value)
end

### END US2459 Test Steps ###

### All Vitals US1957 Test Steps ###

When(/^the client requests all vitals for patient DFN: "(.*?)" from FileMan dates "(.*?)" to "(.*?)"$/) do |dfn, start, stop|
  path = String.new(DefaultLogin.rdk_fetch_url)
  @response = HTTPartyWithBasicAuth.get_with_authorization(path+'/resource/vitals/all?dfn='+dfn+'&start='+start+'&end='+stop+'&pid=10108V420871')
end

Then(/^the JSON response contains vital sign data$/) do
  p @response.body
end

### END US1957 Test Steps ###

### END F129 Test Steps ###

######

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

When(/^the client saves an vital for "(.*?)" with the paramters$/) do |pid, table|
  # table is a Cucumber::Ast::Table
  path = String.new(DefaultLogin.rdk_writeback_url)
  params = table.rows_hash
  params[:vitals] = JSON.parse(params[:vitals])
  @response = HTTPartyWithBasicAuth.post_json_with_authorization("#{path}/resource/writeback/vitals/save?pid=#{pid}", Hash["param", params].to_json, { "Content-Type"=>"application/json" })
end

Then(/^the new vital is stored in the patientrecord for "(.*?)" with "(.*?)" field "(.*?)"$/) do |pid, field, value|
  path = String.new(DefaultLogin.rdk_fetch_url)
  @response = HTTPartyWithBasicAuth.get_with_authorization("#{path}/resource/patientrecord/domain/vital?filter=eq(#{field},#{value})&pid=#{pid}")
  num_records = @response.parsed_response['data']['totalItems']
  unless num_records == 1
    fail "There were #{num_records} vitals for #{pid}; there should have been exactly 1."
  end
  @ien = @response.parsed_response['data']['items'][0]['localId']
  @pid = pid
end

Then(/^the new vital can be marked in error$/) do
  p "Deleting vital with ien=#{@ien}"
  path = String.new(DefaultLogin.rdk_writeback_url)
  @response = HTTPartyWithBasicAuth.put_json_with_authorization("#{path}/resource/writeback/vitals/error?pid=#{@pid}", "{\"ien\":\"#{@ien}\",\"reason\":\"1\" }", { "Content-Type"=>"application/json" })
  unless @response.parsed_response['data']['success']
    fail "Response was not successful: #{@response}"
  end
end

When(/^the client requests the CAT QUAL$/) do
  path = String.new(DefaultLogin.rdk_fetch_url)
  @response = HTTPartyWithBasicAuth.get_with_authorization(path+'/vitals/qualifiers')
end

When(/^the client requests the CAT QUAL with type: "(.*?)"$/) do |type|
  path = String.new(DefaultLogin.rdk_fetch_url)
  @response = HTTPartyWithBasicAuth.get_with_authorization(path+'/vitals/qualifiers?types='+type)
end

When(/^the client requests vitals data for the patient "(.*?)"$/) do |pid|
  temp = QueryRDKCCB.new(pid)
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

Then(/^the all have low and high limits$/) do
  num_records = @response.parsed_response['data']['totalItems']
  for i in 0..num_records-1 do
    if (@response.parsed_response['data']['items'][i]['typeName'] == "PULSE OXIMETRY") \
      || (@response.parsed_response['data']['items'][i]['typeName'] == "BLOOD PRESSURE") \
      || (@response.parsed_response['data']['items'][i]['typeName'] == "PAIN") \
      || (@response.parsed_response['data']['items'][i]['typeName'] == "BMI") \
      || (@response.parsed_response['data']['items'][i]['typeName'] == "PULSE") \
      || (@response.parsed_response['data']['items'][i]['typeName'] == "RESPIRATION")
      low_field = @response.parsed_response['data']['items'][i]['low']
      high_filed = @response.parsed_response['data']['items'][i]['high']
      if (low_field == nil) || (high_filed == nil) || (low_field == "") || (high_filed == "")
        p "Problem with Reference Range"
        break
      end
    end
  end
end
