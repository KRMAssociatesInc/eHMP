Given(/^"(.*?)"$/) do |arg1|
  p "this is a manual step: #{arg1}"
end

When(/^client requests the healthcheck details in RDK format$/) do
  path = RDClass.resourcedirectory_fetch.get_url("healthcheck-detail")
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the RDK healthcheck response contains$/) do |table|
  @json_object = JSON.parse(@response.body)

  result_array = @json_object["data"]["subChecks"]
  search_json(result_array, table)
end

Then(/^the RDK healthcheck response "(.*?)" contains$/) do |arg1, table|
  @json_object = JSON.parse(@response.body)

  result_array = @json_object["data"][arg1]
  p result_array 
  found = true
  table.rows.each do |field_path, field_value_string|
    if result_array[field_path].to_s != field_value_string
      p result_array[field_path]
      found = false
    end
  end
  expect(found).to be_true
end

When(/^client requests the healthcheck healthy flag$/) do
  path = RDClass.resourcedirectory_fetch.get_url("healthcheck-healthy")
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the response is "(.*?)"$/) do |arg1|
  @json_object = JSON.parse(@response.body)
  @json_object.delete("status")
  expect(@json_object.to_s).to eq(arg1)
end

When(/^client requests the healthcheck details html in RDK format$/) do
  path = RDClass.resourcedirectory_fetch.get_url("healthcheck-detail-html")
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the response contains html elements$/) do
  response_body = @response.body
  expect(response_body.include? "<html>").to be_true
  expect(response_body.include? "</html>").to be_true
end

Then(/^the RDK healthcheck detail response for "(.*?)" contains$/) do |arg1, table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"][arg1]
  p result_array

  result_array = []
  result_array[0] = @json_object["data"][arg1]
  search_json(result_array, table)
end

When(/^client requests the healthcheck noupdate on demand in RDK format$/) do
  path = RDClass.resourcedirectory_fetch.get_url("healthcheck-noupdate")
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^client requests the healthcheck checks in RDK format$/) do
  path = RDClass.resourcedirectory_fetch.get_url("healthcheck-checks")
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the RDK healthcheck checks response for "(.*?)" contains dependencies$/) do |arg1, table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"][arg1]
  dependencies = result_array["dependencies"]
  p dependencies
  table.rows.each do |depend|
    expect(dependencies.include? depend[0]).to be_true, "#{dependencies} did not include required #{depend}"
  end 
end
