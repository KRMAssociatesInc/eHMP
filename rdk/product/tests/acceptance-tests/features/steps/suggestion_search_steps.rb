path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the user types three letters of "(.*?)" for the patient "(.*?)" in VPR format$/) do |text, pid|
  query_rdk_search_suggestion = RDKQuery.new('patient-record-search-suggest')
  query_rdk_search_suggestion.add_parameter("pid", pid)
  query_rdk_search_suggestion.add_parameter("query", text)
  path = query_rdk_search_suggestion.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the corresponding total suggested items are "(.*?)"/) do |total_items|
  @json_object = JSON.parse(@response.body)
  expected_total_items = @json_object["data"]["totalItems"]
  expect(expected_total_items.to_s).to eq(total_items)
end

