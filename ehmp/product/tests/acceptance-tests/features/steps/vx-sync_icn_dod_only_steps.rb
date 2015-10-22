path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the data return for "(.*?)" is "(.*?)"$/) do |arg1, arg2|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["syncStatus"]["completedStamp"]["sourceMetaStamp"].keys
end

Then(/^the client recieved data just for site\(s\) "(.*?)"$/) do |site_list|
  site_list = site_list.upcase.split";"
  
  @json_object = JSON.parse(@response.body)
  completed_result_array = @json_object["syncStatus"]["completedStamp"]["sourceMetaStamp"].keys
  
  result = (completed_result_array - site_list) + (site_list - completed_result_array)
  fail "The site name does not match for site(s): \n #{result}" unless result.empty?
end

Then(/^the job status array and inProgress array are empty$/) do
  @json_object = JSON.parse(@response.body)
  job_status = @json_object["jobStatus"]
  inprogress_result_array = @json_object["syncStatus"]["inProgress"]
  
  fail "The Job Status array is not empty: \n #{job_status}" unless job_status.empty?
  fail "The inProgress array is not empty: \n #{job_status}" unless inprogress_result_array.nil?
end

