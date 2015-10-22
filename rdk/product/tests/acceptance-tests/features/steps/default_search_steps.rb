path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the client requests default patient search with accessCode "(.*?)" in VPR format from RDK API$/) do |accessCode|
  query = RDKQuery.new('search-default-search')
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, accessCode, TestClients.password_for(accessCode))
end
