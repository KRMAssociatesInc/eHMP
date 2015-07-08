path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the user searches for a patient "(.*?)" in VPR format$/) do |last_name|
# https://10.3.3.5/vpr/search/Patient/?name=EIGHT
  path = QuerySearch.new("fullName", last_name).path
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the user searches in summary results for a patient "(.*?)" in VPR format$/) do |last_name|
# https://10.3.3.5/vpr/search/Patient/?name=EIGHT&resultsRecordType=summary
  path = QuerySearch.new("fullName", last_name).add_parameter("resultsRecordType", "summary")
  p path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the VPR results contain:$/) do |table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["items"]

  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_vlaue(result_array, table)
end

Then(/^corresponding matching records totaling "(.*?)" are displayed$/) do |total|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["totalItems"]
  if total == "IS_SET"
    expect(result_array).to be > 0, "response total items should not be zero; response body #{result_array}"
  else
    expect(result_array.to_s).to eq(total), "response total items was #{total}: response body #{result_array}"
  end
end
