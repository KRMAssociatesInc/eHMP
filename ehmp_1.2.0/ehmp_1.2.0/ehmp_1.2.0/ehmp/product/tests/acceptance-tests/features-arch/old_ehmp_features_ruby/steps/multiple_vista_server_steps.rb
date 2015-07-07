path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

# Then(/^the results contain lab "(.*?)" results$/) do |not_used, table|
# @json_object = JSON.parse(@response.body)
# result_array = @json_object["entry"]
#
# json_verify = VerifyJsonRuntimeValue.new
# json_verify.verify_json_runtime_vlaue(result_array, table)
# end
#

Then(/^the patient with pid "(.*?)" have the same data on both server$/) do |pid|
  base_url = DefaultLogin.fhir_url
  p path = "#{base_url}/admin/sync/#{pid}"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"

  @json_object = JSON.parse(@response.body)
  response_ve1 = @json_object

  base_url = DefaultLogin.ve2_fhir_url
  p path = "#{base_url}/admin/sync/#{pid}"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"

  @json_object = JSON.parse(@response.body)
  response_ve2 = @json_object

  domains = %w[allergy med appointment document factor immunization lab order problem consult image visit vital cpt education pov]

  domains.each do |domain|
    response_ve1["data"]["items"][0]['syncStatusByVistaSystemId']['9E7A']['domainExpectedTotals']['vital']['total']
    ve1_total = response_ve1["data"]["items"][0]['syncStatusByVistaSystemId']['9E7A']['domainExpectedTotals'][domain]['total']
    ve1_count = response_ve1["data"]["items"][0]['syncStatusByVistaSystemId']['9E7A']['domainExpectedTotals'][domain]['count']

    ve2_total = response_ve2["data"]["items"][0]['syncStatusByVistaSystemId']['9E7A']['domainExpectedTotals'][domain]['total']
    ve2_count = response_ve2["data"]["items"][0]['syncStatusByVistaSystemId']['9E7A']['domainExpectedTotals'][domain]['count']

    expect(ve1_total).to eq(ve2_total), "VE1 response code was #{ve1_total} and VE2 response code was #{ve2_total}"
    expect(ve1_count).to eq(ve2_count), "VE1 response code was #{ve1_count} and VE2 response code was #{ve2_count}"
  end
end
