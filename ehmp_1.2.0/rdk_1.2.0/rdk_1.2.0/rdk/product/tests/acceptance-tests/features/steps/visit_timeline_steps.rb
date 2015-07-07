path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
#require 'VerifyJsonRuntimeValue.rb'

#-------------------------------------------------
Given(/^the client requests visits for the patient "(.*?)"$/) do |arg1|
  path = QueryVisistHistory.new(arg1).path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end


