# Place holder for Allergy test information
class DefaultAllergyPatient
  attr_reader :pid
  attr_reader :search_term
  attr_reader :search_result_count
  attr_reader :patient_name
  attr_reader :num_allergies
  def initialize
    @pid = "10108"
    @search_term = "Eight"
    @search_result_count = 38
    @patient_name = "Eight,Patient"
    @num_allergies = 2
  end
end

Given(/^a patient with allergies in multiple VistAs$/) do
  @test_patient = DefaultAllergyPatient.new
  p  @test_patient.pid
end

When(/^the client requests allergies for the patient "(.*?)"$/) do |pid|
  query_with_path_no_range "/vpr/view/gov.va.cpe.vpr.queryeng.AllergiesViewDef", pid
end

Then(/^eHMP returns all allergies in the results$/) do
  num_expected_results = @test_patient.num_allergies
  num_of_actual_results = count_number_of_results
  expect(num_of_actual_results).to be(num_expected_results)
end

When(/^user requests allergies for that patient$/) do

  # cucumber step: When user types "Eight" in the "Search Field"
  search_term = @test_patient.search_term
  select_patient_from_list = @test_patient.patient_name
  AccessPatientStepReuse.user_types_in_the(search_term, "Search Field")

  # cucumber step: Then the patient list displays "38" results
  num_results =  @test_patient.search_result_count
  verification_passed = AccessPatientStepReuse.wait_for_patientlist_length(num_results, DefaultLogin.wait_time)
  expect(verification_passed).to be_true

  # cucumber step: And user selects "Eight,Patient" from the patient list
  AccessPatientStepReuse.user_selects_from_patient_list(select_patient_from_list)

  expected_posting = "Allergies"
  # cucumber step: patient has a "Allergies" posting
  posting = expected_posting + "posting"
  patient_details = PatientDetailsHTMLElements.instance
  patient_details.wait_until_element_present(posting, DefaultLogin.wait_time)
  expect(patient_details.static_dom_element_exists?(posting)).to be_true

  # cucumber step: user views the posting details
  patient_details = PatientDetailsHTMLElements.instance
  patient_details.perform_action("Postings")
end

Then(/^the eHMP UI displays allergy "(.*?)" with details$/) do |allergy_name, table|
  driver = TestSupport.driver
  sleep 2
  header_xpath = "//h3[contains(string(), '#{allergy_name}')]"
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
  wait.until { driver.find_element(:xpath=> header_xpath) } # wait until specific list element is shown
  header_id = driver.find_element(:xpath=> header_xpath).attribute("id")

  errors = Array.new
  error_thrown = false

  table.rows.each do | row |
    row.each do |column |
      table_column_xpath = "//h3[@id='#{header_id}']/following-sibling::table[1]/descendant::td[contains(string(), '#{column}')]"
      begin
        driver.find_element(:xpath=>table_column_xpath)
      rescue
        error_thrown = true
        errors.push "did not find #{column} under header #{allergy_name}"
      end
    end
  end

  p errors if error_thrown
  expect(error_thrown).to be_false
end

When(/^the client requests allergies for that patient "(.*?)"$/) do |pid|
  temp = QueryFhir.new("AdverseReaction")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  #p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)

end

When(/^the client requests allergies for the patient "(.*?)" in FHIR format$/) do |pid|
  temp = QueryFhir.new("AdverseReaction")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

Then(/^the client receives (\d+) FHIR DoD result\(s\)$/) do |number_of_results|
  json = JSON.parse(@response.body)
  output_string = ""

  fieldsource = "entry.content.identifier.value"
  steps_source = fieldsource.split('.')

  result_array = json["entry"]

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  num_vista_results = 0
  source_dod = /urn:va:.*:DOD/
  source_allvalues.each do | value |
    unless source_dod.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
  end
  expect(num_vista_results).to eq(number_of_results.to_i)
end

Then(/^the client receives (\d+) FHIR VistA result\(s\)$/) do |number_of_results|
  json = JSON.parse(@response.body)
  output_string = ""

  fieldsource = "entry.content.identifier.value"
  steps_source = fieldsource.split('.')

  result_array = json["entry"]

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  num_vista_results = 0
  source_panorama = /urn:va:.*:9E7A/
  source_kodak = /urn:va:.*:C877/
  source_allvalues.each do | value |
    #if value.start_with? "urn:va:allergy:B362" #PANORAMA
    unless source_panorama.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
    unless source_kodak.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
  end
  expect(num_vista_results).to eq(number_of_results.to_i)
end

class AllergyResponseParse
  def initialize(json_object)
    @json_verify = JsonVerifier.new
    @dateformat = DefaultDateFormat.format
    @found = false
    @result_array = json_object["entry"]
  end # initialize

  def found
    return @found
  end

  def num_results_remaining
    return @result_array.length
  end

  def parse(fieldpath, fieldvaluestring)
    @json_verify.reset_output
    if fieldvaluestring.eql? "IS_FORMATTED_DATE"
      @found = @json_verify.matches_date_format(fieldpath, @dateformat, @result_array)
    elsif fieldvaluestring.eql? "IS_SET"
      @found = @json_verify.defined?([fieldpath], @result_array)
    elsif fieldvaluestring.start_with? "CONTAINS"
      term = fieldvaluestring.split(' ')
      fieldvalue = [term[1]]
      @found = @json_verify.object_contains_partial_value(fieldpath, fieldvalue, @result_array)
    else
      @found = @json_verify.build_subarray(fieldpath, fieldvaluestring, @result_array)
      @result_array = @json_verify.subarry
    end

    if @found == false
      #      output = @json_verify.output
      #      output.each do | msg|
      #        p msg
      #      end #output.each
      puts @json_verify.error_message
    end # if found == false
  end
end

Then(/^the FHIR results contain allergy$/) do |table|
  @json_object = JSON.parse(@response.body)

  parser = AllergyResponseParse.new(@json_object)
  table.rows.each do | fieldpath, fieldvaluestring |
    parser.parse(fieldpath, fieldvaluestring)

    expect(parser.found).to be_true
    expect(parser.num_results_remaining).to_not eq(0)
  end # table.rows.each
end

Then(/^the FHIR results contain$/) do | table |
  dateformat = DefaultDateFormat.format
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  allfound = true
  table.rows.each do | fieldpath, fieldvaluestring |
    json_verify.reset_output

    if fieldvaluestring.eql? "IS_FORMATTED_DATE"
      found = json_verify.all_matches_date_format(fieldpath, dateformat, [@json_object])
    elsif fieldvaluestring.eql? "IS_SET"
      found = json_verify.defined?([fieldpath], @json_object)
    elsif fieldvaluestring.start_with? "CONTAINS"
      term = fieldvaluestring.split(' ')
      fieldvalue = [term[1]]
      found = json_verify.object_contains_partial_value(fieldpath, fieldvalue, [@json_object])
    else
      fieldvalue = [fieldvaluestring]
      found = json_verify.object_contains_path_value_combo(fieldpath, fieldvalue, [@json_object])
    end # if
    allfound = allfound && found
    if found == false
      output = json_verify.output
      output.each do | msg|
        p msg
      end # output.each
      puts json_verify.error_message
    end # if found == false

  end # table.rows.each
  expect(allfound).to be_true
end

Then(/^the client receives (\d+) VPR DoD result\(s\)$/) do |number_of_results|
  fail "Expected response code 200, received #{@response.code}: response body #{@response.body}" unless @response.code == 200
  json = JSON.parse(@response.body)
  output_string = ""

  fieldsource = "data.items.uid"
  steps_source = fieldsource.split('.')

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  # p source_allvalues
  num_vista_results = 0
  source_dod = /urn:va:.*:DOD/
  source_allvalues.each do | value |
    unless source_dod.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
  end
  expect(num_vista_results).to eq(number_of_results.to_i)
end

Then(/^the client receives (\d+) JDS VistA result\(s\)$/) do |number_of_results|
  json = JSON.parse(@response.body)
  output_string = ""

  fieldsource = "data.items.uid"
  steps_source = fieldsource.split('.')

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  num_vista_results = 0
  source_panorama = /urn:va:vlerdocument:VLER:/
  #source_icn = /urn:va:syncstatus:.\d/
 # source_panorama = /.*9E7A;3*/
  #source_kodak = /urn:va:.*:C877/
  source_allvalues.each do | value |
    #if value.start_with? "urn:va:allergy:B362" #PANORAMA
    #unless source_icn.match(value).nil?
     # num_vista_results = num_vista_results + 1
    #end       
    unless source_panorama.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
    #unless source_kodak.match(value).nil?
     # num_vista_results = num_vista_results + 1
    #end 
  end
  expect(num_vista_results).to eq(number_of_results.to_i)
end

Then(/^the client receives (\d+) VPR VistA result\(s\)$/) do |number_of_results|
  json = JSON.parse(@response.body)
  output_string = ""

  fieldsource = "data.items.uid"
  steps_source = fieldsource.split('.')

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  num_vista_results = 0
  source_icn = /urn:va:syncstatus:.\d/
  source_panorama = /urn:va:.*:9E7A/
  source_kodak = /urn:va:.*:C877/
  source_allvalues.each do | value |
    #if value.start_with? "urn:va:allergy:B362" #PANORAMA
    unless source_icn.match(value).nil?
      num_vista_results = num_vista_results + 1
    end       
    unless source_panorama.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
    unless source_kodak.match(value).nil?
      num_vista_results = num_vista_results + 1
    end 
  end
  expect(num_vista_results).to eq(number_of_results.to_i)
end

Then(/^VPR returns (\d+) VistA result\(s\)$/) do |number_of_results|
  p "STOP USING THIS FUNCTION, USE the client receives (\d+) VPR VistA result\(s\)"
  json = JSON.parse(@response.body)
  output_string = ""

  fieldsource = "data.items.uid"
  steps_source = fieldsource.split('.')

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  num_vista_results = 0
  source_panorama = /urn:va:.*:9E7A/
  source_kodak = /urn:va:.*:C877/
  source_allvalues.each do | value |
    #if value.start_with? "urn:va:allergy:B362" #PANORAMA
    unless source_panorama.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
    unless source_kodak.match(value).nil?
      num_vista_results = num_vista_results + 1
    end
  end
  expect(num_vista_results).to eq(number_of_results.to_i)
end

Then(/^JDS returns (\d+) results$/) do |num_results|
  @json_object = JSON.parse(@response.body)
  expect(@json_object["data"]["totalItems"]).to eq(num_results.to_i)
end

def print_json_verify(json_verify)
  output = json_verify.output
  output.each do | msg|
    p msg
  end #output.each
end

Then(/^the VPR results contain allergy terminology from "(.*?)"$/) do |arg1, table|
  dateformat = DefaultDateFormat.format

  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["data"]["items"]
  table.rows.each do | fieldpath, fieldvaluestring |
    json_verify.reset_output
    if fieldvaluestring.eql? "IS_FORMATTED_DATE"
      found = json_verify.matches_date_format(fieldpath, dateformat, result_array)
    elsif fieldvaluestring.eql? "IS_NOT_SET"
      found = json_verify.not_defined?([fieldpath], result_array)
    elsif fieldvaluestring.eql? "IS_SET"
      found = json_verify.defined?([fieldpath], result_array)
    elsif fieldvaluestring.start_with? "CONTAINS"
      term = fieldvaluestring.split(' ')
      fieldvalue = [term[1]]
      found = json_verify.object_contains_partial_value(fieldpath, fieldvalue, result_array)
    else
      found = json_verify.build_subarray(fieldpath, fieldvaluestring, result_array)
      result_array = json_verify.subarry
    end

    if found == false
      output = json_verify.output
      output.each do | msg|
        p msg
      end #output.each
      puts "for field #{fieldpath}: #{json_verify.error_message}"
    end # if found == false
    expect(found).to be_true
    expect(result_array.length).to_not eq(0)
  end # table.rows.each
end

Then(/^the VPR results contain$/) do |table|
  dateformat = DefaultDateFormat.format

  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["data"]["items"]
  table.rows.each do | fieldpath, fieldvaluestring |
    json_verify.reset_output
    if fieldvaluestring.eql? "IS_FORMATTED_DATE"
      found = json_verify.matches_date_format(fieldpath, dateformat, result_array)
    elsif fieldvaluestring.eql? "IS_SET"
      found = json_verify.defined?([fieldpath], result_array)
    elsif fieldvaluestring.eql? "IS_NOT_SET"
      found = json_verify.not_defined?([fieldpath], result_array)
    elsif fieldvaluestring.start_with? "CONTAINS"
      term = fieldvaluestring.split(' ')
      fieldvalue = [term[1]]
      found = json_verify.object_contains_partial_value(fieldpath, fieldvalue, result_array)
    else
      found = json_verify.build_subarray(fieldpath, fieldvaluestring, result_array)
      result_array = json_verify.subarry
    end

    if found == false
      output = json_verify.output
      output.each do | msg|
        p msg
      end #output.each
      puts "for field #{fieldpath}: #{json_verify.error_message}"
    end # if found == false
    expect(found).to be_true
    expect(result_array.length).to_not eq(0)
  end # table.rows.each
end

Then(/^expected fields match$/) do |table|
  dateformat = DefaultDateFormat.format

  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["entry"]
  output_string = ""
  table.rows.each do | fieldsource, fieldmatch |
    steps_source = fieldsource.split('.')
    steps_match = fieldmatch.split('.')
    source_allvalues = []
    match_allvalues = []
    json_verify.save_all_values_of_path(0, steps_source, result_array[0], output_string, source_allvalues)
    json_verify.save_all_values_of_path(0, steps_match, result_array[0], output_string, match_allvalues)
    source_allvalues.each do | value |
      value.sub! '#', ''
      do_they_match = match_allvalues.include?(value)
      p "looking for fieldsource #{value} in fieldmatch #{match_allvalues}" unless do_they_match
      expect(do_they_match).to be_true
    end # source_allvalues.each
  end #table.rows.each
end

Then(/^response is a json object$/) do
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new
  print_json_verify(json_verify)
end
