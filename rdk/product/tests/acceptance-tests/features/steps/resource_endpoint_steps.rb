When(/^client requests the patient resource directory in RDK format$/) do
  path = RDClass.resourcedirectory_fetch.get_url("resource-directory")
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the response contains (\d+) "(.*?)" items$/) do |number_of, tag|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object[tag]
  expect(result_array.length).to eq(number_of.to_i)
end

Then(/^the RDK response contains$/) do |table|
  @json_object = JSON.parse(@response.body)

  result_array = @json_object["data"]["link"]
  search_json(result_array, table)
end

Then(/^the RDK response for patient "(.*?)" contains URI for domains$/) do |_pid, table|
  json_object = JSON.parse(@response.body)
  
  output_string = ""
  fieldsource = "link"
  steps_source = fieldsource.split('.')

  result_array = json["links"]

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json_object, output_string, source_allvalues)
  
  expect(source_allvalue.length).to eq(14)
  
  table.each do |domain|
    domain_path = QueryRDK.new(domain).path
    expect(source_allvalues.include? domain_path).to be_true
  end
end
