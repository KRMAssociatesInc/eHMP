path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

Then(/^the VPR results contain "(.*?)"$/) do |_arg1, table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["items"]

  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_vlaue(result_array, table)
end

Then(/^the FHIR results contain "(.*?)"$/) do |_arg1, table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["entry"]

  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_vlaue(result_array, table)
end

Then(/^the VPR results contain data from multiple VistAs should be greater than$/) do |table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object

  table.rows.each do |field, expected_value|
    runtime_json_value = @json_object['data'][field]
    unless runtime_json_value > expected_value.to_i
      fail "There value found is less than value of '#{expected_value}' in field '#{field}'.\n Returned Json values:"+"\n"+"#{runtime_json_value}"
    end
    
  end
end

Then(/^the data return for "(.*?)" is "(.*?)"$/) do |site_name, ex_value|
  source_sites_name = ['PANORAMA', 'KODAK']
  errors = "The request site name [#{site_name}] did not find on define sites: #{source_sites_name} "
  fail errors unless source_sites_name.include? site_name.upcase
  
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]['items'][0]['syncStatusByVistaSystemId']
  value = 'FALSE'
  if (site_name.upcase == 'KODAK') && (result_array.keys.include? 'C877')
    value = 'TRUE' 
  elsif (site_name.upcase == 'PANORAMA') && (result_array.keys.include? '9E7A')
    value = 'TRUE'
  end
  
  expect(value).to eq(ex_value.upcase)
end

