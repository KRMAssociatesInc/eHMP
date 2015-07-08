When(/^the client searches demographics for patient name "(.*?)" through FHIR$/) do |name|
  temp = SearchFhir.new("name", name)
  temp.add_format("json")
  temp.add_acknowledge("true")
  #p temp.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(temp.path)
end

Then(/^the response contains "(.*?)" results$/) do |num_results|
  json_object = JSON.parse(@response.body)
  total_results = json_object["totalResults"]
  expect(total_results).to eq(num_results.to_i)
end

Then(/^each result contains the substring "(.*?)"$/) do |subst|
  json = JSON.parse(@response.body)
  output_string = ""

  fieldsource = "entry.content.name.text"
  steps_source = fieldsource.split('.')

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  p source_allvalues.length
  pattern = /#{subst}/

  source_allvalues.each do | name |
    contains_pattern = pattern.match(name)
    p "#{name} does not contain expected substring #{subst}" if contains_pattern.nil?
    expect(pattern.match(name)).to_not be_nil
  end
end
