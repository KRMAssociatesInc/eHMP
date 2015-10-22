require "httparty"

Given(/^the request data was sent for patient "(.*?)" with content "(.*?)"$/) do |pid, payload|
  path = String.new(DefaultLogin.rdk_writeback_url) + "/resource/write-health-data/patient/#{pid}/allergies?"
  type = { "Content-Type" => "application/json" }
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, payload, type)
  puts @response
end

Then(/^the allergy data is stored successsully/) do
  puts @response.code
  expect(@response.code).to eq(200)
end

Then(/^the server status error code returned$/) do
  puts @response.code
  expect(@response.code).to eq(500)
end
