path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

Then(/^the VPR result\(s\) contain "(.*?)"$/) do |arg1, table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["items"]

  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_vlaue(result_array, table)
end

Then(/^the FHIR result\(s\) contain "(.*?)"$/) do |arg1, table|
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
  source_sites_name = %W[PANORAMA KODAK VLER DOD DAS HDR]
  site_name = site_name.upcase
  errors = "The request site name [#{site_name}] did not find on define sites: #{source_sites_name} "
  fail errors unless source_sites_name.include? site_name
  
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]['items'][0]['syncStatusByVistaSystemId']
  value = 'FALSE'
  if (site_name == 'KODAK') && (result_array.keys.include? 'C877')
    value = 'TRUE' 
  elsif (site_name == 'PANORAMA') && (result_array.keys.include? '9E7A')
    value = 'TRUE'
  elsif (site_name == 'DOD') && (result_array.keys.include? 'DOD')
    value = 'TRUE'
  elsif (site_name == 'DAS') && (result_array.keys.include? 'DAS')
    value = 'TRUE'
  elsif (site_name == 'VLER') && (result_array.keys.include? 'VLER')
    value = 'TRUE'
  elsif (site_name == 'HDR') && (result_array.keys.include? 'HDR')
    value = 'TRUE'
  end
  
  expect(value).to eq(ex_value.upcase)
end

