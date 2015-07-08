path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the client requests operational sync status for multitple sites$/) do
 # path = "http://10.2.2.110:9080/data/find/syncstatus?filter=eq%28forOperational,true%29#"
  base_jds_url = DefaultLogin.jds_url
  p path = "#{base_jds_url}/data/find/syncstatus?filter=eq%28forOperational,true%29#"
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

Then(/^the operational sync results contain different domains from "(.*?)"$/) do |arg1, table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["items"]

  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_vlaue(result_array, table)
end
