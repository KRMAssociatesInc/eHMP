path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the client requests default quantity for param"(.*?)" and pid "(.*?)"$/) do |arg1, arg2 |
  path = MedQuantity.new(arg1, arg2).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

