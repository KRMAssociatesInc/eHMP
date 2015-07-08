path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the client searches for "(.*?)" for the patient "(.*?)" in VPR format$/) do |text, pid|
  base_solr_url = DefaultLogin.solr_url
  p path = "#{base_solr_url}/solr/vpr/select?q=*#{text}*&fq=pid:#{pid}&wt=json&indent=true&start=0&rows=1000"
           #http://10.3.3.10:8983/solr/vpr/select?q=*rad*&fq=pid:10108&wt=json&indent=true&start=0&rows=1000&
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the solar search results contains "(.*?)"/) do |total_items|

  @json_object = JSON.parse(@response.body)
  expected_total_items = @json_object["response"]["numFound"]
  expect(expected_total_items.to_s).to eq(total_items)
end

Then(/^the solar search results contains$/) do |table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["response"]["docs"]
  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_vlaue(result_array, table)
end
