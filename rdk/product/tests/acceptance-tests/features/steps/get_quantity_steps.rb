path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the client requests default quantity for param"(.*?)" and pid "(.*?)"$/) do |arg1, arg2|
  query = RDKQuery.new('med-op-data-daytoquantity')
  query.add_parameter("param", arg1) 
  query.add_parameter("pid", arg2) 
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

