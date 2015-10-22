When(/^the client requests to see the list of tasks assigned to a role$/) do
  query = RDKQuery.new('tasks-tasks')
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client requests to see the list of tasks for patient "(.*?)"$/) do |pid|
  query = RDKQuery.new('tasks-tasksbypatient')
  query.add_parameter("patientid", pid)
  path = query.path
  @response = HTTPartyWithBasicAuth.get_with_authorization(path)
end

When(/^the client creates a process with content "(.*?)"$/) do |content|
  path = RDKStartProcess.new.path
  p path
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, content, { "Content-Type" => "application/json" })
  @new_process_id = @response["data"]["processInstanceId"]
  puts "New Process Id = #{@new_process_id}"
end

When(/^the client changes state of the new process to "(.*?)"$/) do |state|
  query = RDKQuery.new('tasks-changestate')
  query.add_parameter("taskid", @new_process_id) unless @new_process_id.nil?
  query.add_parameter("state", state) 
  path = query.path
  @response = HTTPartyWithBasicAuth.post_with_authorization(path)
end

When(/^the client changes state of the new process to complete with content "(.*?)"$/) do |content|
  query = RDKQuery.new('tasks-changestate')
  query.add_parameter("taskid", @new_process_id) unless @new_process_id.nil?
  query.add_parameter("state", 'complete') 
  path = query.path
  @response = HTTPartyWithBasicAuth.post_json_with_authorization(path, content, { "Content-Type" => "application/json" })
end

Then(/^the result is an empty array$/) do
  @json_object = JSON.parse(@response.body)
  str = @json_object.to_s
  expect(str.include? "\"items\"=>[]").to be_true
end

Then(/^the results do not contain "(.*?)"$/) do |value|
  @json_object = JSON.parse(@response.body)
  str = @json_object.to_s
  expect(str.include? value).to be_false
end
