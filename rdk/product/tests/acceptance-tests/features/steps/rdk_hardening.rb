When(/^the client "(.*?)" requests user info$/) do |client|
  path = RDClass.resourcedirectory_fetch.get_url("user-service-userinfo")
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, client, TestClients.password_for(client))
end

def search_json(result_array, table, dateformat = DefaultDateFormat.format)
  json_verify = JsonVerifier.new
  table.rows.each do |fieldpath, fieldvaluestring|
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
    elsif fieldvaluestring.start_with? "RDK_URL"
      term = fieldvaluestring.split(' ')
      fieldvalue = [term[1]]
      full_url = "#{DefaultLogin.rdk_fetch_url}#{fielvalue}"
      p "verifying full url: #{full_url}"
      found = json_verify.build_subarray(fieldpath, full_url, result_array)
      result_array = json_verify.subarry
    else
      found = json_verify.build_subarray(fieldpath, fieldvaluestring, result_array)
      result_array = json_verify.subarry
    end

    if found == false
      output = json_verify.output
      output.each do |msg|
        p msg
      end #output.each
      puts "for field #{fieldpath}: #{json_verify.error_message}"
    end # if found == false
    expect(found).to eq(true)
    expect(result_array.length).to_not eq(0)
  end # table.rows.each
end

Then(/^the RDK user info response contains$/) do |table|
  dateformat = DefaultDateFormat.format

  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = []
  result_array.push(@json_object["data"])
  search_json(result_array, table, dateformat)
end
