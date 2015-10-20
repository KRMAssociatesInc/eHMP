Then(/^the clients searches for medications with the string "(.*?)"$/) do |search_string|
  path = "#{DefaultLogin.rdk_writeback_url}/resource/writeback/med/search?searchParam=#{search_string}"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the client Search  Medication Schedule for the patient "(.*?)" and "(.*?)" in VPR format$/) do |_pid, _uid|
  path = "#{DefaultLogin.rdk_writeback_url}/resource/writeback/med/schedule?param=%7B%22dfn%22:%22100695%22,%22locien%22:%220%22%7D"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the client Search  Default Medication for the patient "(.*?)" and "(.*?)" in VPR format$/) do |_pid, _uid|
  path = "#{DefaultLogin.rdk_writeback_url}/resource/writeback/med/defaults?param=%7B%22oi%22:%221348%22,%22pstype%22:%22X%22,%22orvp%22:%20100695,%22needpi%22:%22Y%22,%20%22pkiactiv%22:%22Y%22%7D"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client adds a non\-VA medication for patient "(.*?)" with the content "(.*?)"$/) do |pid, content|
  path = "#{DefaultLogin.rdk_writeback_url}/resource/writeback/medication/save/nonVA?pid=" + pid
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, content, { "Content-Type" => "application/json" })
end

Then(/^the client Search  Medication List begin with ALC for the patient "(.*?)" and "(.*?)" in VPR format$/) do |_pid, _uid|
  path = "#{DefaultLogin.rdk_writeback_url}/resource/writeback/med/searchlist?param=%7B%22search%22:%22alc%22,%22count%22:%2210%22%7D"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the response contains "(.*?)"$/) do |thisStuff|
  response_body = @response.body
  expect(response_body.include? thisStuff).to be_true
  @order_id = @response.parsed_response['data']['items']
  p "new medication order uid = " + @order_id
end

Then(/^the new Non\-VA Med order can be discontinued for patient "(.*?)" with reason "(.*?)", location IEN "(.*?)" and provider IEN "(.*?)"$/) do |_pid, reason, locationIen, providerIen|
  path = "#{DefaultLogin.rdk_writeback_url}/resource/writeback/medication/save/discontinue?pid=10113V428140"
  content = {
    param: {
      ien: providerIen,
      locien: locationIen,
      orderien: @order_id,
      reason: reason
    }
  }
  @response = HTTPartyWithBasicAuth.put_json_with_authorization(path, content.to_json, { "Content-Type" => "application/json" })
  p @response
end

Then(/^the Non VA Med discontinue reasons List is requested$/) do
  path = "#{DefaultLogin.rdk_writeback_url}/resource/writeback/med/discontinuereason"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end
