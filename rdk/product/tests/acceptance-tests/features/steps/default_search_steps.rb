path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

#http://10.4.4.105:8888/resource/search/my-cprs-list
#http://10.4.4.105:8888/resource/search/my-cprs-list?accessCode=1tdnurse&verifyCode=tdnurse1&site=9E7A
When(/^the client requests default patient search with accessCode "(.*?)" in VPR format from RDK API$/) do |accessCode|
  resource_query = DefaultPatientSearch.new
  path = resource_query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, accessCode, TestClients.password_for(accessCode))
end
