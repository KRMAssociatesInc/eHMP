path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the user searches "(.*?)" for the patient "(.*?)" in VPR format$/) do |domain, pid|
  path = QueryRDK.new(pid, domain).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the corresponding number of groups displayed is "(.*?)"/) do |total|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["items"]
  expect(result_array.length.to_s).to eq(total), "response total groups was #{total}: response body #{result_array.length}"
end

Then(/^the corresponding total of items in each group is "(.*?)"/) do |total_items|
  @json_object = JSON.parse(@response.body)
  expected_total_items = @json_object["data"]["foundItemsTotal"]
  expect(expected_total_items.to_s).to eq(total_items)
end
