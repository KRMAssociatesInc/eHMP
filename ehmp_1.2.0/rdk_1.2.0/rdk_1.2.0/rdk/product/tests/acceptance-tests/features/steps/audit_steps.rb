Given(/^an authorized client "(.*?)" has requested patient search for patient "(.*?)"$/) do |username, name|
  temp = SearchRDK.new
  temp.add_parameter("name.full", name)
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(temp.path, username, TestClients.password_for(username))
end

Given(/^an authorized client "(.*?)" has requested resource directory$/) do |username|
  path = RDClass.resourcedirectory.get_url("resource-directory")
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, TestClients.password_for(username))
end

Given(/^an authorized client "(.*?)" has requested clinical notes for patient "(.*?)"$/) do |username, pid|
  path = QueryRDKDomain.new("document", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, TestClients.password_for(username))
end

Given(/^an authorized client "(.*?)" has requested problem list for patient "(.*?)"$/) do |username, pid|
  path = QueryRDKDomain.new("problem", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, TestClients.password_for(username))
end

Given(/^an authorized client "(.*?)" has requested lab for patient "(.*?)"$/) do |username, pid|
  path = QueryRDKDomain.new("lab", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, TestClients.password_for(username))
end

Given(/^an authorized client "(.*?)" has requested radiology for patient "(.*?)"$/) do |username, pid|
  path = QueryRDKDomain.new("rad", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, TestClients.password_for(username))
end

Given(/^an authorized client "(.*?)" has requested medications for patient "(.*?)"$/) do |username, pid|
  path = QueryRDKDomain.new("med", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, TestClients.password_for(username))
end

Given(/^an authorized client "(.*?)" has requested demographics for patient "(.*?)"$/) do |username, pid|
  path = QueryRDKDomain.new("patient", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, TestClients.password_for(username))
end

Given(/^an authorized client "(.*?)" has requested allergies for patient "(.*?)"$/) do |username, pid|
  path = QueryRDKDomain.new("allergy", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, TestClients.password_for(username))
end

Given(/^an authorized client "(.*?)" has requested vitals for patient "(.*?)"$/) do |username, pid|
  path = QueryRDKDomain.new("vital", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, username, TestClients.password_for(username))
end

When(/^audit logs for patient "(.*?)" are requested$/) do |pid|
  path = QueryRDKAudit.new("pid", pid).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, "AuditLogUser", TestClients.password_for("AuditLogUser"))
end

Then(/^the audit log entry contains$/) do |table|
  #2014-06-30T20:38:51.825Z
  dateformat = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ/

  @json_object = JSON.parse(@response.body)

  audit_array = @json_object
  expect(audit_array.length).to be > 0
  result_array = []
  result_array.push(audit_array[audit_array.length-1])
  search_json(result_array, table, dateformat)
end

When(/^audit logs for user "(.*?)" are requested$/) do |username|
  path = QueryRDKAudit.new("user", username).path
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, "AuditLogUser", TestClients.password_for("AuditLogUser"))
end

Given(/^the rdk audit logs are cleared$/) do
  path = RDClass.resourcedirectory.get_url("audit-record-clear")
  @response = HTTPartyWithBasicAuth.get_with_authorization_for_user(path, "AuditLogUser", TestClients.password_for("AuditLogUser"))
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

if __FILE__ == $PROGRAM_NAME
  p TestClients.password_for("B362;pu1234")
  p TestClients.password_for("badname")
end
