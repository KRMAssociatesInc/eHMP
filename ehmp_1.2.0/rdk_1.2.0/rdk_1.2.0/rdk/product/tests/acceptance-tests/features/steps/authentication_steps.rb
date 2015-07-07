path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
#require 'VerifyJsonRuntimeValue.rb'

When(/^the client requests authentication with accessCode "(.*?)" and verifyCode "(.*?)" and site "(.*?)" and contentType "(.*?)"$/) do |accessCode, verifyCode, site, contentType|
  resource_query = Authentication.new
  jsonreq = { "accessCode"=> accessCode, "verifyCode" => verifyCode, "site" => site } 

  reqjson = jsonreq.to_json
  path = resource_query.path
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, reqjson, { 'Content-Type' => 'application/json' })
end

Then(/^the authentication result contains$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new
  result_array = []
  result_array.push(@json_object)
  search_json(result_array, table)
end
