When(/^the client adds Outpatient Medication "(.*?)" for the patient "(.*?)" and "(.*?)" in VPR format from RDK API$/) do |opmed, pid, _uid|
  path = "#{DefaultLogin.rdk_writeback_url}/resource/writeback/opmed/save?pid="+pid
  p path
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, opmed, { "Content-Type"=>"application/json" })
  p @response
end

Then(/^the outpatient medication after Save response contains "(.*?)"$/) do |response|
  response_body = @response.body
  expect(response_body.include? response).to be_true
end
