When(/^the client requests vitals for the patient "(.*?)" in FHIR format$/) do |pid|
  #  base_url = DefaultLogin.fhir_url
  #  path = "#{base_url}/fhir/Observation?subject.identifier=#{pid}&_format=json"
  #  p path
  #  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  #
  temp = QueryFhir.new("Observation")
  temp.add_parameter("subject.identifier", pid)
  temp.add_format("json")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

Then(/^the FHIR results contain vitals/) do |table|
  # the dateformat for vitals appears to be different that what was defined as default
  dateformat = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d-\d\d:\d\d/

  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["entry"]
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

    # p "subarray #{found} #{fieldvaluestring} #{json_verify.subarry.length}"
    # p "------------------------"
    if found == false
      # output = json_verify.output()
      # output.each do | msg|
      # p msg
      # end #output.each
      puts json_verify.error_message
      #
    end # if found == false
    expect(found).to be_true
    expect(result_array.length).to_not eq(0)
  end # table.rows.each
end
